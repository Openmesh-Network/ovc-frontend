import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { useRouter } from "next/router";
import { Address } from "viem";
import { TagVotingContract } from "@/ovc-indexer/contracts/TagVoting";

export function useProposalVoting(plugin: Address, proposalId: bigint) {
  const { reload } = useRouter();
  const { addAlert } = useAlerts() as AlertContextProps;
  const {
    writeContract: voteWrite,
    data: votingTxHash,
    error: votingError,
    status: votingStatus,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: votingTxHash });

  // Loading status and errors
  useEffect(() => {
    if (votingStatus === "idle" || votingStatus === "pending") return;
    else if (votingStatus === "error") {
      if (votingError?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        addAlert("Could not create the proposal", { type: "error" });
      }
      return;
    }

    // success
    if (!votingTxHash) return;
    else if (isConfirming) {
      addAlert("Vote submitted", {
        description: "Waiting for the transaction to be validated",
        txHash: votingTxHash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Vote registered", {
      description: "The transaction has been validated",
      type: "success",
      txHash: votingTxHash,
    });

    reload();
  }, [votingStatus, votingTxHash, isConfirming, isConfirmed]);

  const voteProposal = (votingOption: number, autoExecute: boolean = false) => {
    voteWrite({
      abi: TagVotingContract.abi,
      address: plugin,
      functionName: "vote",
      args: [proposalId, votingOption, autoExecute],
    });
  };

  return {
    voteProposal,
    votingStatus,
    isConfirming,
    isConfirmed,
  };
}
