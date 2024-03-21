import { Proposal } from "@/plugins/dualGovernance/utils/types";
import { If } from "@/components/if";
import * as DOMPurify from "dompurify";
import { ActionCard } from "@/components/actions/action";

const DEFAULT_PROPOSAL_METADATA_SUMMARY = "(No description available)";

export default function ProposalDescription(proposal: Proposal) {
  return (
    <div className="pt-2">
      <div
        className="pb-6"
        dangerouslySetInnerHTML={{
          __html: proposal.summary
            ? DOMPurify.sanitize(proposal.summary)
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
