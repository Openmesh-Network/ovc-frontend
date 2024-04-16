import { ActionRequest } from "@/trustless-indexer/types/trustless-actions";
import { maxUint64 } from "viem";
export const RATIO_BASE = 1_000_000;

export function getProposalStatusVariant(
  proposal: ActionRequest,
  executableFrom?: bigint
) {
  if (proposal.executed) return { variant: "primary", label: "Executed" };
  if (!executableFrom) return { variant: "info", label: "Loading..." };
  if (executableFrom === maxUint64)
    return { variant: "critical", label: "Rejected" };

  const executionDate = new Date(Number(executableFrom) * 1000);
  if (executionDate.getTime() <= new Date().getTime())
    return { variant: "success", label: "Executable" };
  return {
    variant: "info",
    label: `Executable from ${executionDate.toDateString()} ${executionDate.toTimeString()}`,
  };
}
