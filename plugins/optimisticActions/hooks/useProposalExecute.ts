import { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { useRouter } from "next/router";
import { Address } from "viem";
import { OptimisticActionsContract } from "@/contracts/OptimisticActions";

export function useProposalExecute(
  dao: Address,
  proposalId: number,
  executableFrom?: bigint
) {
  const { reload } = useRouter();
  const { addAlert } = useAlerts() as AlertContextProps;

  const {
    writeContract: executeWrite,
    data: executeTxHash,
    error: executingError,
    status: executingStatus,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: executeTxHash });

  const executeProposal = () => {
    executeWrite({
      abi: OptimisticActionsContract.abi,
      address: OptimisticActionsContract.address,
      functionName: "executeAction",
      args: [dao, proposalId],
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
      executableFrom !== undefined &&
      executableFrom <= new Date().getTime() / 1000,
    isConfirming,
    isConfirmed,
  };
}
