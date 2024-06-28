"use client";

import { ClaimRequestReturn } from "@/ovc-indexer/api/return-types";
import { reviver } from "@/ovc-indexer/openrd-indexer/utils/json";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ShowClaimRequest } from "../components/claim-request";

export function OVCClaiming() {
  const { address } = useAccount();
  const [requests, setRequests] = useState<ClaimRequestReturn>([]);

  useEffect(() => {
    const getRequests = async () => {
      if (!address) {
        setRequests([]);
        return;
      }

      const response = await axios.get(`/indexer/claimRequest/${address}`);
      if (response.status !== 200) {
        throw new Error(`Fetching claim request error: ${response.data}`);
      }
      setRequests(JSON.parse(JSON.stringify(response.data), reviver));
    };

    getRequests().catch(console.error);
  }, [address]);

  if (!address) {
    return <span>Connect your wallet to view your claim requests.</span>;
  }

  return (
    <div className="flex gap-2">
      {requests.map((request, i) => (
        <ShowClaimRequest key={i} request={request} />
      ))}
    </div>
  );
}
