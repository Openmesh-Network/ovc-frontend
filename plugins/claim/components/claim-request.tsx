"use client";

import { VerifiedContributorClaimingContract } from "@/contracts/VerifiedContributorClaiming";
import { usePerformTransaction } from "@/hooks/usePerformTransaction";
import { ClaimRequest } from "@/ovc-indexer/types/requests";
import { Button, Card } from "@aragon/ods";
import { Address, Hex, formatUnits, parseSignature } from "viem";
import { sepolia } from "viem/chains";
import { useReadContract } from "wagmi";

export function ShowClaimRequest({ request }: { request: ClaimRequest }) {
  const { performTransaction, performingTransaction } = usePerformTransaction({
    chainId: sepolia.id,
  });

  const { data: executed } = useReadContract({
    abi: VerifiedContributorClaimingContract.abi,
    address: VerifiedContributorClaimingContract.address,
    functionName: "proofClaimed",
    args: [BigInt(request.claimId)],
  });

  return (
    <Card className="flex flex-col p-2">
      <span className="font-semibold text-xl">
        #{request.claimId}: {formatUnits(BigInt(request.amount), 18)} OPEN
      </span>
      <span>{executed ? "executed" : request.type}</span>
      {!executed && request.type === "approved" && (
        <Button
          onClick={() => {
            const sig = parseSignature(request.approvedSig as Hex);
            performTransaction({
              transaction: async () => {
                return {
                  abi: VerifiedContributorClaimingContract.abi,
                  address: VerifiedContributorClaimingContract.address,
                  functionName: "claim",
                  args: [
                    Number(sig.v),
                    sig.r,
                    sig.s,
                    BigInt(request.claimId),
                    request.receiver as Address,
                    BigInt(request.amount),
                  ],
                };
              },
            });
          }}
          disabled={performingTransaction}
        >
          Claim
        </Button>
      )}
    </Card>
  );
}
