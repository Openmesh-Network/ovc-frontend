import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { useEffect } from "react";
import { Address, zeroAddress } from "viem";
import { TagVotingContract } from "@/ovc-indexer/contracts/TagVoting";

export function useUserCanVote(plugin: Address, proposalId: bigint) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: canVote, refetch: refreshCanVote } = useReadContract({
    address: plugin,
    abi: TagVotingContract.abi,
    functionName: "canVote",
    args: [proposalId, address ?? zeroAddress, 1],
  });

  useEffect(() => {
    refreshCanVote();
  }, [blockNumber]);

  return canVote;
}
