import { VerifiedContributorContract } from "@/ovc-indexer/contracts/VerifiedContributor";
import { useReadContract } from "wagmi";

export function useVotingToken(blockNumber?: bigint) {
  const {
    data: tokenSupply,
    isError: isError1,
    isLoading: isLoading1,
  } = useReadContract({
    address: VerifiedContributorContract.address,
    abi: VerifiedContributorContract.abi,
    functionName: "getPastTotalSupply",
    args: [blockNumber ?? BigInt(0)],
  });

  const {
    data: tokenSymbol,
    isError: isError2,
    isLoading: isLoading2,
  } = useReadContract({
    address: VerifiedContributorContract.address,
    abi: VerifiedContributorContract.abi,
    functionName: "symbol",
  });

  return {
    address: VerifiedContributorContract.address,
    tokenSupply,
    symbol: tokenSymbol,
    status: {
      isLoading: isLoading1 || isLoading2,
      isError: isError1 || isError2,
    },
  };
}
