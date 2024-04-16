import { Hash, zeroAddress } from "viem";
import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { VerifiedContributorTagManagerContract } from "@/ovc-indexer/contracts/VerifiedContributorTagManager";

export function useCanCreateProposal(tag: Hash) {
  const { address } = useAccount();
  const [hasTag, setHasTag] = useState<boolean>(false);
  const { data: contractRead } = useReadContract({
    address: VerifiedContributorTagManagerContract.address,
    abi: VerifiedContributorTagManagerContract.abi,
    functionName: "hasTag",
    args: [address ?? zeroAddress, tag],
  });

  useEffect(() => {
    if (contractRead === undefined) {
      return;
    }

    setHasTag(contractRead);
  }, [contractRead]);

  if (!address) return false;
  else if (hasTag) return true;
}
