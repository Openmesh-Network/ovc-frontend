import { useReadContract } from "wagmi";
import { useState, useEffect } from "react";
import ProposalDescription from "@/plugins/optimisticActions/components/proposal/description";
import ProposalHeader from "@/plugins/optimisticActions/components/proposal/header";
import { Address } from "viem";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import { useProposalRejecting } from "../hooks/useProposalRejecting";
import { useProposalExecute } from "../hooks/useProposalExecute";
import { OptimisticActionsContract } from "@/contracts/OptimisticActions";
import { useCanRejectProposal } from "../hooks/useCanRejectProposal";
import {
  IndexedActionRequest,
  IndexedActionRequests,
} from "@/trustless-indexer/types/trustless-actions";
import { defaultChain } from "@/config/wagmi-config";
import axios from "axios";
import { If } from "@/components/if";
import RejectionModal from "../components/vote/rejection-modal";
import { AddToIpfsRequest, AddToIpfsResponse } from "@/pages/api/addToIpfs";

export default function ProposalDetail({
  dao,
  trustlessManagement,
  role,
  id: proposalId,
}: {
  dao: Address;
  trustlessManagement: Address;
  role: bigint;
  id: number;
}) {
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const skipRender = useSkipFirstRender();
  const [baseAction, setBaseAction] = useState<
    IndexedActionRequest | undefined
  >(undefined);

  useEffect(() => {
    const getBaseAction = async () => {
      const response = await axios.get(
        `/trustless-indexer/trustlessActions/${defaultChain.id}/${OptimisticActionsContract.address}/${dao}`
      );
      const proposalInfo = response.data as IndexedActionRequests;
      setBaseAction(proposalInfo.getRequest[proposalId]);
    };

    getBaseAction().catch(console.error);
  });

  const { data: optimisticAction } = useReadContract({
    abi: OptimisticActionsContract.abi,
    address: OptimisticActionsContract.address,
    functionName: "getOptimsticAction",
    args: [dao, proposalId],
  });

  const {
    voteProposal,
    votingStatus,
    isConfirming: isVoteConfirming,
  } = useProposalRejecting(dao, trustlessManagement, role, proposalId);
  const {
    canExecute,
    executeProposal,
    isConfirming: isExecuteConfirming,
  } = useProposalExecute(dao, proposalId, optimisticAction?.executableFrom);

  const userCanVote = useCanRejectProposal(trustlessManagement, role);

  const showProposalLoading = !baseAction || !optimisticAction;
  const showTransactionConfirming =
    votingStatus === "pending" || isVoteConfirming || isExecuteConfirming;

  if (skipRender || showProposalLoading) {
    return (
      <section className="flex justify-left items-left w-screen max-w-full min-w-full">
        <PleaseWaitSpinner />
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center w-screen max-w-full min-w-full">
      <div className="flex justify-between py-5 w-full">
        <ProposalHeader
          proposalNumber={Number(proposalId) + 1}
          baseAction={baseAction}
          executableFrom={optimisticAction.executableFrom}
          transactionConfirming={showTransactionConfirming}
          canVote={!!userCanVote && !baseAction.executed}
          canExecute={canExecute && !baseAction.executed}
          onReject={() => setShowRejectionModal(true)}
          onExecute={() => executeProposal()}
        />
      </div>

      <div className="py-12 w-full">
        <div className="flex flex-row space-between">
          <h2 className="flex-grow text-3xl text-neutral-900 font-semibold">
            Description
          </h2>
        </div>

        <ProposalDescription {...baseAction} />
      </div>

      <If condition={showRejectionModal}>
        <RejectionModal
          onDismissModal={() => setShowRejectionModal(false)}
          onReject={(reason) => {
            setShowRejectionModal(false);
            const request: AddToIpfsRequest = {
              json: JSON.stringify({
                reason: reason,
              }),
            };
            axios
              .post("/api/addToIpfs", request)
              .then((response) => response.data as AddToIpfsResponse)
              .then((response) => response.cid)
              .then((cid) => `ipfs://${cid}`)
              .then((metadata) => voteProposal(metadata))
              .catch(console.error);
          }}
        />
      </If>
    </section>
  );
}
