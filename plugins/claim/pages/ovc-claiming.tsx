"use client";

import { ClaimRequestReturn } from "@/ovc-indexer/api/return-types";
import { reviver } from "@/ovc-indexer/openrd-indexer/utils/json";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ShowClaimRequest } from "../components/claim-request";
import { Address } from "viem";
import { FilterEventsReturn } from "@/vesting-indexer/api/return-types";
import { ObjectFilter } from "@/vesting-indexer/api/filter";
import {
  reviver as vestingReviver,
  replacer,
} from "@/vesting-indexer/utils/json";
import { ShowVesting } from "../components/vesting";

export function OVCClaiming() {
  const { address } = useAccount();
  const [requests, setRequests] = useState<ClaimRequestReturn>([]);
  const [vestings, setVestings] = useState<Address[]>([]);

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

  useEffect(() => {
    const getVestings = async () => {
      if (!address) {
        setVestings([]);
        return;
      }

      const filter: ObjectFilter = {
        type: { equal: "BeneficiaryCreated" },
        beneficiary: {
          equal: address.toLowerCase(),
          convertValueToLowercase: true,
        },
      };
      const response = await axios.post(
        "/vesting-indexer/filterEvents/",
        JSON.parse(JSON.stringify(filter, replacer))
      );
      if (response.status !== 200) {
        throw new Error(`Fetching vesting events error: ${response.data}`);
      }
      const events = JSON.parse(
        JSON.stringify(response.data),
        vestingReviver
      ) as FilterEventsReturn;
      setVestings(events.map((event) => event.address));
    };

    getVestings().catch(console.error);
  }, [address]);

  if (!address) {
    return <span>Connect your wallet to view your claims.</span>;
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {requests.map((request, i) => (
        <ShowClaimRequest key={i} request={request} />
      ))}
      {vestings.map((contract, i) => (
        <ShowVesting key={i} contract={contract} />
      ))}
    </div>
  );
}
