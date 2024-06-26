import {
  useAccount,
  useBlockNumber,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { ReactNode, useEffect, useState } from "react";
import ProposalCard from "@/plugins/tokenVoting/components/proposal";
import { TokenVotingAbi } from "@/plugins/tokenVoting/artifacts/TokenVoting.sol";
import { Button, CardEmptyState, IconType } from "@aragon/ods";
import { useCanCreateProposal } from "@/plugins/tokenVoting/hooks/useCanCreateProposal";
import Link from "next/link";
import { Else, ElseIf, If, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import { digestPagination } from "@/utils/pagination";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/router";
import { deployment } from "@/ovc-indexer/contracts/deployment";
import { defaultChain } from "@/config/wagmi-config";
import DelegateModal from "../components/vote/delegate-modal";
import { VerifiedContributorContract } from "@/ovc-indexer/contracts/VerifiedContributor";

export default function Proposals() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { push } = useRouter();

  const { data: blockNumber } = useBlockNumber({ watch: true });
  const canCreate = useCanCreateProposal();
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: proposalCountResponse,
    isLoading,
    refetch,
  } = useReadContract({
    chainId: defaultChain.id,
    address:
      deployment.departments.departmentDaos.departmentFactory.departmentOwner
        .tokenVoting,
    abi: TokenVotingAbi,
    functionName: "proposalCount",
  });

  const { writeContractAsync: delegate } = useWriteContract();
  const [showDelegateModal, SetShowDelegateModal] = useState(false);

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  const skipRender = useSkipFirstRender();
  if (skipRender) return <></>;

  const proposalCount = Number(proposalCountResponse);
  const { visibleProposalIds, showNext, showPrev } = digestPagination(
    proposalCount,
    currentPage
  );

  return (
    <MainSection>
      <SectionView>
        <h1 className="justify-self-start text-3xl font-semibold align-middle">
          Proposals
        </h1>
        <div className="justify-self-end flex gap-x-1">
          <Button
            iconLeft={IconType.FAVORITE}
            size="md"
            variant="primary"
            onClick={() => SetShowDelegateModal(true)}
          >
            Delegate
          </Button>
          <If condition={canCreate && proposalCount}>
            <Link href="#/new">
              <Button iconLeft={IconType.PLUS} size="md" variant="primary">
                Submit Proposal
              </Button>
            </Link>
          </If>
        </div>
      </SectionView>
      <If condition={proposalCount}>
        <Then>
          {visibleProposalIds.map((id) => (
            <ProposalCard key={id} proposalId={BigInt(id)} />
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
        <ElseIf condition={isLoading}>
          <SectionView>
            <PleaseWaitSpinner />
          </SectionView>
        </ElseIf>
        <ElseIf condition={isConnected}>
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
                onClick: () => push("#/new"),
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
      <If condition={showDelegateModal}>
        <DelegateModal
          onDismissModal={() => SetShowDelegateModal(false)}
          onDelegate={(to) => {
            delegate({
              abi: VerifiedContributorContract.abi,
              address: VerifiedContributorContract.address,
              functionName: "delegate",
              args: [to],
            }).catch(console.error);
            SetShowDelegateModal(false);
          }}
        />
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
