import { Address, erc721Abi, zeroAddress } from "viem";
import { useState, useEffect } from "react";
import {
  useBalance,
  useAccount,
  useReadContracts,
  useReadContract,
} from "wagmi";
import { TokenVotingAbi } from "@/plugins/tokenVoting/artifacts/TokenVoting.sol";
import { defaultChain } from "@/config/wagmi-config";
import { deployment } from "@/ovc-indexer/contracts/deployment";

export function useCanCreateProposal() {
  const { address } = useAccount();
  const [minProposerVotingPower, setMinProposerVotingPower] =
    useState<bigint>();
  const [votingToken, setVotingToken] = useState<Address>();
  const { data: balance } = useReadContract({
    abi: erc721Abi,
    address: votingToken,
    functionName: "balanceOf",
    args: [address ?? zeroAddress],
    chainId: defaultChain.id,
  });

  const { data: contractReads } = useReadContracts({
    contracts: [
      {
        chainId: defaultChain.id,
        address:
          deployment.departments.departmentDaos.departmentFactory
            .departmentOwner.tokenVoting,
        abi: TokenVotingAbi,
        functionName: "minProposerVotingPower",
      },
      {
        chainId: defaultChain.id,
        address:
          deployment.departments.departmentDaos.departmentFactory
            .departmentOwner.tokenVoting,
        abi: TokenVotingAbi,
        functionName: "getVotingToken",
      },
    ],
  });

  useEffect(() => {
    if (!contractReads?.length || contractReads?.length < 2) return;

    setMinProposerVotingPower(contractReads[0].result as bigint);
    setVotingToken(contractReads[1].result as Address);
  }, [contractReads?.[0]?.status, contractReads?.[1]?.status]);

  if (!address) return false;
  else if (!minProposerVotingPower) return true;
  else if (!balance) return false;
  else if (balance >= minProposerVotingPower) return true;

  return false;
}
