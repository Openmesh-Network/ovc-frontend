import Link from "next/link";
import { getProposalStatusVariant } from "@/plugins/optimisticActions/utils/proposal-status";
import { Card, Tag } from "@aragon/ods";
import * as DOMPurify from "dompurify";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { IndexedActionRequest } from "@/trustless-indexer/types/trustless-actions";
import { useReadContract } from "wagmi";
import { OptimisticActionsContract } from "@/contracts/OptimisticActions";
import { Address } from "viem";

const DEFAULT_PROPOSAL_METADATA_TITLE = "(No proposal title)";
const DEFAULT_PROPOSAL_METADATA_SUMMARY =
  "(The metadata of the proposal is not available)";

type ProposalInputs = {
  dao: Address;
  id: number;
  proposal: IndexedActionRequest;
};

export default function ProposalCard(props: ProposalInputs) {
  const { data: optimisticAction } = useReadContract({
    abi: OptimisticActionsContract.abi,
    address: OptimisticActionsContract.address,
    functionName: "getOptimisticAction",
    args: [props.dao, props.id],
  });

  const metadata = {
    title: DEFAULT_PROPOSAL_METADATA_TITLE,
    summary: undefined as string | undefined,
  };
  if (props.proposal.cachedMetadata) {
    try {
      const json = JSON.parse(props.proposal.cachedMetadata);
      metadata.title = json.title ?? metadata.title;
      metadata.summary = json.summary ?? metadata.summary;
    } catch (err) {
      console.error(`Metadata is not valid json: ${err}`);
    }
  }

  if (!props) {
    return (
      <section className="w-full mb-4">
        <Card className="p-4">
          <span className="px-4 py-5 xs:px-10 md:px-6 lg:px-7">
            <PleaseWaitSpinner fullMessage="Loading proposal..." />
          </span>
        </Card>
      </section>
    );
  }

  const { variant: statusVariant, label: statusLabel } =
    getProposalStatusVariant(props.proposal, optimisticAction?.executableFrom);

  return (
    <Link href={`#/${props.dao}/proposals/${props.id}`} className="w-full">
      <Card className="w-full mb-4 p-5">
        <div className="w-full">
          <div className="flex mb-2">
            <Tag variant={statusVariant as any} label={statusLabel} />
          </div>

          <div className="text-ellipsis overflow-hidden">
            <h4 className=" mb-1 text-lg font-semibold text-dark line-clamp-1">
              {Number(props.id) + 1} - {metadata.title}
            </h4>
            <div
              className="text-ellipsis overflow-hidden box line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: metadata.summary
                  ? DOMPurify.sanitize(metadata.summary)
                  : DEFAULT_PROPOSAL_METADATA_SUMMARY,
              }}
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}
