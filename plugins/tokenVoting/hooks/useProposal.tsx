import { useState, useEffect } from "react";
import { useBlockNumber, usePublicClient, useReadContract } from "wagmi";
import { Hex, fromHex, getAbiItem } from "viem";
import { TokenVotingAbi } from "@/plugins/tokenVoting/artifacts/TokenVoting.sol";
import { Action } from "@/utils/types";
import {
  Proposal,
  ProposalMetadata,
  ProposalParameters,
  Tally,
} from "@/plugins/tokenVoting/utils/types";
import { useMetadata } from "@/hooks/useMetadata";
import { deployment } from "@/ovc-indexer/contracts/deployment";
import { defaultChain } from "@/config/wagmi-config";

type ProposalCreatedLogResponse = {
  args: {
    actions: Action[];
    allowFailureMap: bigint;
    creator: string;
    endDate: bigint;
    startDate: bigint;
    metadata: string;
    proposalId: bigint;
  };
};

const ProposalCreatedEvent = getAbiItem({
  abi: TokenVotingAbi,
  name: "ProposalCreated",
});

export function useProposal(proposalId: string, autoRefresh = false) {
  const publicClient = usePublicClient({ chainId: defaultChain.id });
  const [proposalCreationEvent, setProposalCreationEvent] =
    useState<ProposalCreatedLogResponse["args"]>();
  const [metadataUri, setMetadata] = useState<string>();
  const { data: blockNumber } = useBlockNumber();

  // Proposal on-chain data
  const {
    data: proposalResult,
    error: proposalError,
    fetchStatus: proposalFetchStatus,
    refetch: proposalRefetch,
  } = useReadContract<typeof TokenVotingAbi, "getProposal", any[]>({
    chainId: defaultChain.id,
    address:
      deployment.departments.departmentDaos.departmentFactory.departmentOwner
        .tokenVoting,
    abi: TokenVotingAbi,
    functionName: "getProposal",
    args: [proposalId],
  });
  const proposalData = decodeProposalResultData(proposalResult as any);

  useEffect(() => {
    if (autoRefresh) proposalRefetch();
  }, [blockNumber]);

  // Creation event
  useEffect(() => {
    if (!proposalData || !publicClient) return;

    publicClient
      .getLogs({
        address:
          deployment.departments.departmentDaos.departmentFactory
            .departmentOwner.tokenVoting,
        event: ProposalCreatedEvent as any,
        args: {
          proposalId: proposalId,
        } as any,
        fromBlock: proposalData.parameters.snapshotBlock,
        toBlock: proposalData.parameters.startDate,
      })
      .then((logs) => {
        if (!logs || !logs.length) throw new Error("No creation logs");

        const log: ProposalCreatedLogResponse = logs[0] as any;
        setProposalCreationEvent(log.args);
        setMetadata(fromHex(log.args.metadata as Hex, "string"));
      })
      .catch((err) => {
        console.error("Could not fetch the proposal details", err);
      });
  }, [
    proposalData?.tally.yes,
    proposalData?.tally.no,
    proposalData?.tally.abstain,
    !!publicClient,
  ]);

  // JSON metadata
  const {
    data: metadataContent,
    isLoading: metadataLoading,
    error: metadataError,
  } = useMetadata<ProposalMetadata>(metadataUri);

  const proposal = arrangeProposalData(
    proposalData,
    proposalCreationEvent,
    metadataContent
  );

  return {
    proposal,
    status: {
      proposalReady: proposalFetchStatus === "idle",
      proposalLoading: proposalFetchStatus === "fetching",
      proposalError,
      metadataReady: !metadataError && !metadataLoading && !!metadataContent,
      metadataLoading,
      metadataError: metadataError !== undefined,
    },
  };
}

// Helpers

function decodeProposalResultData(data?: Array<any>) {
  if (!data?.length || data.length < 6) return null;

  return {
    active: data[0] as boolean,
    executed: data[1] as boolean,
    parameters: data[2] as ProposalParameters,
    tally: data[3] as Tally,
    actions: data[4] as Array<Action>,
    allowFailureMap: data[5] as bigint,
  };
}

function arrangeProposalData(
  proposalData?: ReturnType<typeof decodeProposalResultData>,
  creationEvent?: ProposalCreatedLogResponse["args"],
  metadata?: ProposalMetadata
): Proposal | null {
  if (!proposalData) return null;

  return {
    actions: proposalData.actions,
    active: proposalData.active,
    executed: proposalData.executed,
    parameters: proposalData.parameters,
    tally: proposalData.tally,
    allowFailureMap: proposalData.allowFailureMap,
    creator: creationEvent?.creator || "",
    title: metadata?.title || "",
    summary: metadata?.summary || "",
    resources: metadata?.resources || [],
  };
}
