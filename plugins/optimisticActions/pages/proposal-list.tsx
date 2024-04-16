import { useAccount, useBlockNumber } from "wagmi";
import { ReactNode, useEffect, useState } from "react";
import ProposalCard from "@/plugins/optimisticActions/components/proposal";
import { Button, CardEmptyState, IconType } from "@aragon/ods";
import { useCanCreateProposal } from "@/plugins/optimisticActions/hooks/useCanCreateProposal";
import Link from "next/link";
import { Else, ElseIf, If, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import { digestPagination } from "@/utils/pagination";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/router";
import { Address } from "viem";
import { OptimisticActionsContract } from "@/contracts/OptimisticActions";
import axios from "axios";
import { defaultChain } from "@/config/wagmi-config";
import {
  IndexedActionRequest,
  IndexedActionRequests,
} from "@/trustless-indexer/types/trustless-actions";

export default function Proposals({
  dao,
  trustlessManagement,
  role,
}: {
  dao: Address;
  trustlessManagement: Address;
  role: bigint;
}) {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { push } = useRouter();

  const { data: blockNumber } = useBlockNumber({ watch: true });
  const canCreate = useCanCreateProposal(trustlessManagement, role);
  const [currentPage, setCurrentPage] = useState(0);
  const [proposals, setProposals] = useState<
    (IndexedActionRequest & { id: number })[] | undefined
  >(undefined);

  const refetch = () => {
    const getProposals = async () => {
      const response = await axios.get(
        `/trustless-indexer/trustlessActions/${defaultChain.id}/${OptimisticActionsContract.address}/${dao}`
      );
      const proposalInfo = response.data as IndexedActionRequests;
      setProposals(
        Object.keys(proposalInfo.getRequest)
          .map((strId) => {
            const id = Number.parseInt(strId);
            return {
              id: id,
              ...proposalInfo.getRequest[id],
            };
          })
          .sort((p1, p2) => p1.id - p2.id)
      );
    };

    getProposals().catch(console.error);
  };

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  const skipRender = useSkipFirstRender();
  if (skipRender) return <></>;

  const { visibleProposalIds, showNext, showPrev } = digestPagination(
    proposals?.length ?? 0,
    currentPage
  );

  return (
    <MainSection>
      <SectionView>
        <h1 className="justify-self-start text-3xl font-semibold align-middle">
          Proposals
        </h1>
        <div className="justify-self-end">
          <If condition={canCreate}>
            <Link href={`#/${dao}/new/`}>
              <Button iconLeft={IconType.PLUS} size="md" variant="primary">
                Submit Proposal
              </Button>
            </Link>
          </If>
        </div>
      </SectionView>
      <If condition={proposals && proposals.length !== 0}>
        <Then>
          {proposals &&
            visibleProposalIds.map((id) => (
              <ProposalCard
                key={id}
                dao={dao}
                id={proposals[id].id}
                proposal={proposals[id]}
              />
            ))}
          <div className="w-full flex flex-row justify-end gap-2 mt-4 mb-10">
            <Button
              variant="tertiary"
              size="sm"
              disabled={!showPrev}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
              iconLeft={IconType.CHEVRON_LEFT}
            >
              Previous
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              disabled={!showNext}
              onClick={() => setCurrentPage((page) => page + 1)}
              iconRight={IconType.CHEVRON_RIGHT}
            >
              Next
            </Button>
          </div>
        </Then>
        <ElseIf condition={!proposals}>
          <SectionView>
            <PleaseWaitSpinner />
          </SectionView>
        </ElseIf>
        <ElseIf condition={proposals?.length === 0}>
          <SectionView>
            <CardEmptyState
              className="w-full"
              heading="There are no proposals yet"
              humanIllustration={{
                body: "VOTING",
                expression: "SMILE",
                hairs: "CURLY",
              }}
              primaryButton={{
                label: "Submit the first one",
                iconLeft: IconType.PLUS,
                onClick: () => push(`#/${dao}/new/`),
              }}
            />
          </SectionView>
        </ElseIf>
        <Else>
          <SectionView>
            <CardEmptyState
              className="w-full"
              heading="There are no proposals yet"
              humanIllustration={{
                body: "VOTING",
                expression: "SMILE",
                hairs: "CURLY",
              }}
              primaryButton={{
                label: "Connect your wallet",
                onClick: () => open(),
              }}
            />
          </SectionView>
        </Else>
      </If>
    </MainSection>
  );
}

function MainSection({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col items-center mt-6 w-screen max-w-full">
      {children}
    </main>
  );
}

function SectionView({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row justify-between content-center w-full mb-6">
      {children}
    </div>
  );
}
