"use client";

import { JITSingleBeneficiaryLinearERC20TransferVestingManagerContract } from "@/contracts/JITSingleBeneficiaryLinearERC20TransferVestingManager";
import { SingleBeneficiaryLinearERC20TransferVestingProxyContract } from "@/contracts/SingleBeneficiaryLinearERC20TransferVestingProxyContract";
import { usePerformTransaction } from "@/hooks/usePerformTransaction";
import { Button, Card } from "@aragon/ods";
import { Address, formatUnits } from "viem";
import { sepolia } from "viem/chains";
import { useReadContracts } from "wagmi";

export function ShowVesting({ contract }: { contract: Address }) {
  const { performTransaction, performingTransaction } = usePerformTransaction({
    chainId: sepolia.id,
  });

  const { data: vestingInfo } = useReadContracts({
    contracts: [
      {
        abi: SingleBeneficiaryLinearERC20TransferVestingProxyContract.abi,
        address: contract,
        functionName: "amount",
      },
      {
        abi: SingleBeneficiaryLinearERC20TransferVestingProxyContract.abi,
        address: contract,
        functionName: "start",
      },
      {
        abi: SingleBeneficiaryLinearERC20TransferVestingProxyContract.abi,
        address: contract,
        functionName: "duration",
      },
      {
        abi: SingleBeneficiaryLinearERC20TransferVestingProxyContract.abi,
        address: contract,
        functionName: "beneficiary",
      },
    ],
    allowFailure: false,
    query: {
      staleTime: Infinity,
    },
  });

  const { data: releaseInfo, refetch: releaseRefetch } = useReadContracts({
    contracts: [
      {
        abi: SingleBeneficiaryLinearERC20TransferVestingProxyContract.abi,
        address: contract,
        functionName: "released",
      },
      {
        abi: SingleBeneficiaryLinearERC20TransferVestingProxyContract.abi,
        address: contract,
        functionName: "releasable",
      },
    ],
    allowFailure: false,
  });

  return (
    <Card className="flex flex-col p-2 gap-y-1">
      <span className="font-semibold text-xl">{contract}</span>
      {vestingInfo && (
        <div className="flex flex-col">
          <span>Amount: {formatUnits(vestingInfo[0], 18)}</span>
          <span>
            Start:{" "}
            {new Date(Number(vestingInfo[1]) * 1000).toLocaleDateString()}
          </span>
          <span>
            End:{" "}
            {new Date(
              Number(vestingInfo[1] + vestingInfo[2]) * 1000
            ).toLocaleDateString()}
          </span>
        </div>
      )}
      {releaseInfo && (
        <div className="flex flex-col">
          <span>Claimed: {formatUnits(releaseInfo[0], 18)}</span>
          <span>Claimable: {formatUnits(releaseInfo[1], 18)}</span>
        </div>
      )}
      <Button
        onClick={() => {
          performTransaction({
            transaction: async () => {
              if (!vestingInfo) {
                return undefined;
              }

              return {
                abi: JITSingleBeneficiaryLinearERC20TransferVestingManagerContract.abi,
                address:
                  JITSingleBeneficiaryLinearERC20TransferVestingManagerContract.address,
                functionName: "release",
                args: vestingInfo,
              };
            },
            onConfirmed: (receipt) => {
              releaseRefetch();
            },
          });
        }}
        disabled={!vestingInfo || performingTransaction}
      >
        Claim
      </Button>
    </Card>
  );
}
