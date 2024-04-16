import { useEffect } from "react";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
} from "wagmi";
import { TokenVotingAbi } from "../artifacts/TokenVoting.sol";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { useRouter } from "next/router";
import { defaultChain } from "@/config/wagmi-config";
import { deployment } from "@/ovc-indexer/contracts/deployment";

export function useProposalExecute(proposalId: string) {
  const { reload } = useRouter();
  const { addAlert } = useAlerts() as AlertContextProps;

  const {
    data: canExecute,
    isError: isCanVoteError,
    isLoading: isCanVoteLoading,
  } = useReadContract({
    address:
      deployment.departments.departmentDaos.departmentFactory.departmentOwner
        .tokenVoting,
    abi: TokenVotingAbi,
    chainId: defaultChain.id,
    functionName: "canExecute",
    args: [proposalId],
  });
  const {
    writeContract: executeWrite,
    data: executeTxHash,
    error: executingError,
    status: executingStatus,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: executeTxHash });

  const executeProposal = () => {
    if (!canExecute) return;

    executeWrite({
      chainId: defaultChain.id,
      abi: TokenVotingAbi,
      address:
        deployment.departments.departmentDaos.departmentFactory.departmentOwner
          .tokenVoting,
      functionName: "execute",
      args: [proposalId],
    });
  };

  useEffect(() => {
    if (executingStatus === "idle" || executingStatus === "pending") return;
    else if (executingStatus === "error") {
      if (executingError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        console.error(executingError);
        addAlert("Could not execute the proposal", {
          type: "error",
          description:
            "The proposal may contain actions with invalid operations",
        });
      }
      return;
    }

    // success
    if (!executeTxHash) return;
    else if (isConfirming) {
      addAlert("Proposal submitted", {
        description: "Waiting for the transaction to be validated",
        type: "info",
        txHash: executeTxHash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Proposal executed", {
      description: "The transaction has been validated",
      type: "success",
      txHash: executeTxHash,
    });

    setTimeout(() => reload(), 1000 * 2);
  }, [executingStatus, executeTxHash, isConfirming, isConfirmed]);

  return {
    executeProposal,
    canExecute:
      !isCanVoteError && !isCanVoteLoading && !isConfirmed && !!canExecute,
    isConfirming,
    isConfirmed,
  };
}
