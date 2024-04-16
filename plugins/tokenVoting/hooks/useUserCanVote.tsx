import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { TokenVotingAbi } from "@/plugins/tokenVoting/artifacts/TokenVoting.sol";
import { useEffect } from "react";
import { deployment } from "@/ovc-indexer/contracts/deployment";
import { defaultChain } from "@/config/wagmi-config";

export function useUserCanVote(proposalId: bigint) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: canVote, refetch: refreshCanVote } = useReadContract({
    chainId: defaultChain.id,
    address:
      deployment.departments.departmentDaos.departmentFactory.departmentOwner
        .tokenVoting,
    abi: TokenVotingAbi,
    functionName: "canVote",
    args: [proposalId, address, 1],
  });

  useEffect(() => {
    refreshCanVote();
  }, [blockNumber]);

  return canVote;
}
