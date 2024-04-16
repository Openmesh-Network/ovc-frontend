import { deployment } from "@/ovc-indexer/contracts/deployment";
import { erc721Abi } from "viem";
import { useReadContract } from "wagmi";

export function useVotingToken() {
  const {
    data: tokenSupply,
    isError: isError1,
    isLoading: isLoading1,
  } = useReadContract({
    address: deployment.departments.verifiedContributor.verifiedContributor,
    abi: erc721Abi,
    functionName: "totalSupply",
  });

  const {
    data: tokenSymbol,
    isError: isError2,
    isLoading: isLoading2,
  } = useReadContract({
    address: deployment.departments.verifiedContributor.verifiedContributor,
    abi: erc721Abi,
    functionName: "symbol",
  });

  return {
    address: deployment.departments.verifiedContributor.verifiedContributor,
    tokenSupply,
    symbol: tokenSymbol,
    status: {
      isLoading: isLoading1 || isLoading2,
      isError: isError1 || isError2,
    },
  };
}
