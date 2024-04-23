import { Button, Tag } from "@aragon/ods";
import { AlertVariant } from "@aragon/ods";
import { getProposalStatusVariant } from "@/plugins/optimisticActions/utils/proposal-status";
import { Else, ElseIf, If, Then } from "@/components/if";
import { AddressText } from "@/components/text/address";
import { PleaseWaitSpinner } from "@/components/please-wait";
import dayjs from "dayjs";
import { IndexedActionRequest } from "@/trustless-indexer/types/trustless-actions";

const DEFAULT_PROPOSAL_METADATA_TITLE = "(No proposal title)";

interface ProposalHeaderProps {
  proposalNumber: number;
  baseAction: IndexedActionRequest;
  executableFrom: bigint;
  canVote: boolean;
  canExecute: boolean;
  transactionConfirming: boolean;
  onReject: () => void;
  onExecute: () => void;
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  proposalNumber,
  baseAction,
  executableFrom,
  canVote,
  canExecute,
  transactionConfirming,
  onReject,
  onExecute,
}) => {
  const proposalVariant = getProposalStatusVariant(baseAction, executableFrom);

  const metadata = {
    title: DEFAULT_PROPOSAL_METADATA_TITLE,
  };
  if (baseAction.cachedMetadata) {
    try {
      const json = JSON.parse(baseAction.cachedMetadata);
      metadata.title = json.title ?? metadata.title;
    } catch (err) {
      console.error(`Metadata is not valid json: ${err}`);
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-row pb-2 h-16 items-center">
        <div className="flex flex-grow justify-between">
          <div className="flex-col text-center">
            {/** bg-info-200 bg-success-200 bg-critical-200
             * text-info-800 text-success-800 text-critical-800
             */}
            <If condition={proposalVariant.variant}>
              <div className="flex">
                {proposalVariant?.variant && (
                  <Tag
                    className="text-center text-critical-800"
                    label={proposalVariant.label}
                    variant={proposalVariant.variant as AlertVariant}
                  />
                )}
              </div>
            </If>
            <span className="text-xl font-semibold text-neutral-700 pt-1">
              Proposal {proposalNumber}
            </span>
          </div>
        </div>
        <div className="flex">
          <If condition={transactionConfirming}>
            <Then>
              <div>
                <PleaseWaitSpinner fullMessage="Confirming..." />
              </div>
            </Then>
            <ElseIf condition={canExecute}>
              <Button
                className="flex h-5 items-center"
                size="lg"
                variant="success"
                onClick={() => onExecute()}
              >
                Execute
              </Button>
            </ElseIf>
            <ElseIf condition={canVote}>
              <Button
                className="flex h-5 items-center"
                size="lg"
                variant="primary"
                onClick={() => onReject()}
              >
                Reject
              </Button>
            </ElseIf>
          </If>
        </div>
      </div>

      <h4 className="flex-grow mb-1 text-3xl text-neutral-900 font-semibold">
        {metadata.title}
      </h4>
    </div>
  );
};

export default ProposalHeader;
