import { useState, useEffect } from "react";
import { Address, getAbiItem } from "viem";
import {
  Proposal,
  VoteCastEvent,
  VoteCastResponse,
} from "@/plugins/tagVoting/utils/types";
import { usePublicClient } from "wagmi";
import { TagVotingContract } from "@/ovc-indexer/contracts/TagVoting";

const event = getAbiItem({ abi: TagVotingContract.abi, name: "VoteCast" });

export function useProposalVoteList(
  plugin: Address,
  proposalId: bigint,
  proposal: Proposal | null
) {
  const publicClient = usePublicClient();
  const [proposalLogs, setLogs] = useState<VoteCastEvent[]>([]);

  async function getLogs() {
    if (!proposal?.parameters?.snapshotBlock) return;
    else if (!publicClient) return;

    const logs: VoteCastResponse[] = (await publicClient.getLogs({
      address: plugin,
      event: event,
      args: {
        proposalId,
      },
      fromBlock: proposal.parameters.snapshotBlock,
      toBlock: "latest", // TODO: Make this variable between 'latest' and proposal last block
    })) as any;

    const newLogs = logs.flatMap((log) => log.args);
    if (newLogs.length > proposalLogs.length) setLogs(newLogs);
  }

  useEffect(() => {
    getLogs();
  }, [proposalId, proposal?.parameters?.snapshotBlock]);

  return proposalLogs;
}
