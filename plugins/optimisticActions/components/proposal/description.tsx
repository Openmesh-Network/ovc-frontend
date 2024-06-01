import { If } from "@/components/if";
import * as DOMPurify from "dompurify";
import { ActionCard } from "@/components/actions/action";
import { IndexedActionRequest } from "@/trustless-indexer/types/trustless-actions";

const DEFAULT_PROPOSAL_METADATA_SUMMARY = "(No description available)";

export default function ProposalDescription(proposal: IndexedActionRequest) {
  const metadata = {
    summary: undefined as string | undefined,
  };
  if (proposal.cachedMetadata) {
    try {
      const json = JSON.parse(proposal.cachedMetadata);
      metadata.summary = json.summary ?? metadata.summary;
    } catch (err) {
      console.error(`Metadata is not valid json: ${err}`);
    }
  }

  return (
    <div className="pt-2">
      <div
        className="pb-6 prose"
        dangerouslySetInnerHTML={{
          __html: metadata.summary
            ? DOMPurify.sanitize(metadata.summary)
            : DEFAULT_PROPOSAL_METADATA_SUMMARY,
        }}
      />
      <h2 className="flex-grow text-2xl text-neutral-900 font-semibold pt-10 pb-3">
        Actions
      </h2>
      <div className="">
        <If not={proposal.actions.length}>
          <p className="pt-2">The proposal has no actions</p>
        </If>
        {proposal.actions?.map?.((action, i) => (
          <div className="mb-3" key={i}>
            <ActionCard action={action} idx={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
