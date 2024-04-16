import { Address, zeroAddress } from "viem";
import { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { TrustlessManagementContract } from "@/trustless-indexer/contracts/TrustlessManagement";

export function useCanCreateProposal(
  trustlessManagement: Address,
  role: bigint
) {
  const { address } = useAccount();
  const [hasRole, setHasRole] = useState<boolean>(false);
  const { data: contractRead } = useReadContract({
    address: trustlessManagement,
    abi: TrustlessManagementContract.abi,
    functionName: "hasRole",
    args: [address ?? zeroAddress, role],
  });

  useEffect(() => {
    if (contractRead === undefined) {
      return;
    }

    setHasRole(contractRead);
  }, [contractRead]);

  if (!address) return false;
  else if (hasRole) return true;
}
