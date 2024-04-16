import { VerifiedContributorContract } from "@/ovc-indexer/contracts/VerifiedContributor";
import { VerifiedContributorTagManagerContract } from "@/ovc-indexer/contracts/VerifiedContributorTagManager";
import { Hash } from "viem";
import { useReadContract } from "wagmi";

export function useVotingToken(tag: Hash) {
  const {
    data: tokenSupply,
    isError: isError1,
    isLoading: isLoading1,
  } = useReadContract({
    address: VerifiedContributorTagManagerContract.address,
    abi: VerifiedContributorTagManagerContract.abi,
    functionName: "totalTagHavers",
    args: [tag],
  });

  // Maybe change symbol to tag? (lookup known tags for reverse hash)
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
    tokenSupply,
    symbol: tokenSymbol,
    status: {
      isLoading: isLoading1 || isLoading2,
      isError: isError1 || isError2,
    },
  };
}
