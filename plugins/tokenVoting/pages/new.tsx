import {
  Button,
  IconType,
  Icon,
  InputText,
  TextAreaRichText,
  AlertCard,
} from "@aragon/ods";
import React, { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { toHex, zeroHash } from "viem";
import { TokenVotingAbi } from "@/plugins/tokenVoting/artifacts/TokenVoting.sol";
import { useAlerts } from "@/context/Alerts";
import { FunctionCallForm } from "@/components/input/function-call-form";
import { Action } from "@/utils/types";
import { getPlainText } from "@/utils/html";
import { useRouter } from "next/router";
import { Else, If, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { ActionCard } from "@/components/actions/action";
import { defaultPublicClient } from "@/config/wagmi-config";
import { deployment } from "@/ovc-indexer/contracts/deployment";
import { AddToIpfsRequest, AddToIpfsResponse } from "@/pages/api/addToIpfs";
import axios from "axios";
import { DAOContract } from "@/contracts/DAO";

export default function Create() {
  const { push } = useRouter();
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [actions, setActions] = useState<Action[]>([]);
  const [callRevert, setCallRevert] = useState<string>("");
  const { addAlert } = useAlerts();
  const {
    writeContract: createProposalWrite,
    data: createTxHash,
    status,
    error,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: createTxHash });

  useEffect(() => {
    if (status === "idle" || status === "pending") return;
    else if (status === "error") {
      if (error?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        console.error(error);
        addAlert("Could not create the proposal", { type: "error" });
      }
      return;
    }

    // success
    if (!createTxHash) return;
    else if (isConfirming) {
      addAlert("Proposal submitted", {
        description: "Waiting for the transaction to be validated",
        txHash: createTxHash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Proposal created", {
      description: "The transaction has been validated",
      type: "success",
      txHash: createTxHash,
    });

    setTimeout(() => {
      push("#/");
    }, 1000 * 2);
  }, [status, createTxHash, isConfirming, isConfirmed]);

  useEffect(() => {
    const dao =
      deployment.departments.departmentDaos.departmentFactory.departmentOwner;
    defaultPublicClient
      .simulateContract({
        account: dao.tokenVoting,
        abi: DAOContract.abi,
        address: dao.dao,
        functionName: "execute",
        args: [zeroHash, actions, BigInt(0)],
      })
      .then(() => setCallRevert(""))
      .catch((err) => {
        console.error(`Proposal execution error: ${err}`);
        setCallRevert("Proposal execution reverted in simulation.");
      });
  }, [actions]);

  const submitProposal = async () => {
    // Check metadata
    if (!title.trim())
      return addAlert("Invalid proposal details", {
        description: "Please, enter a title",
        type: "error",
      });

    const plainSummary = getPlainText(summary).trim();
    if (!plainSummary.trim())
      return addAlert("Invalid proposal details", {
        description: "Please, enter a summary of what the proposal is about",
        type: "error",
      });

    const proposalMetadataJsonObject = { title, summary };
    const request: AddToIpfsRequest = {
      json: JSON.stringify(proposalMetadataJsonObject),
    };
    const metadata = await axios
      .post("/api/addToIpfs", request)
      .then((response) => response.data as AddToIpfsResponse)
      .then((response) => response.cid)
      .then((cid) => `ipfs://${cid}`);
    console.log(
      `Successfully uploaded token voting proposal metadata to ${metadata}.`
    );
    const failureMap = BigInt(0);
    const startDate = BigInt(0);
    const endDate = BigInt(0);
    const voteOption = 0;
    const tryEarlyExecution = false;
    createProposalWrite({
      abi: TokenVotingAbi,
      address:
        deployment.departments.departmentDaos.departmentFactory.departmentOwner
          .tokenVoting,
      functionName: "createProposal",
      args: [
        toHex(metadata),
        actions,
        failureMap,
        startDate,
        endDate,
        voteOption,
        tryEarlyExecution,
      ],
    });
  };

  const handleTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target?.value);
  };

  const showLoading = status === "pending" || isConfirming;

  return (
    <section className="flex flex-col items-center w-screen max-w-full min-w-full">
      <div className="justify-between py-5 w-full">
        <h1 className="font-semibold text-neutral-900 text-3xl mb-10">
          Create Proposal
        </h1>
        <div className="mb-6">
          <InputText
            className=""
            label="Title"
            maxLength={100}
            placeholder="A short title that describes the main purpose"
            variant="default"
            value={title}
            onChange={handleTitleInput}
          />
        </div>
        <div className="mb-6">
          <TextAreaRichText
            label="Summary"
            className="pt-2"
            value={summary}
            onChange={setSummary}
            placeholder="A description for what the proposal is all about"
          />
        </div>
        <div className="mb-6">
          <span className="font-normal block mb-2 text-lg text-neutral-900 ">
            Select the type of proposal
          </span>
          <div className="mb-6">
            <FunctionCallForm
              publicClient={defaultPublicClient}
              onAddAction={(action) => setActions(actions.concat([action]))}
            />
          </div>
        </div>

        <If condition={showLoading}>
          <Then>
            <div className="mt-14 mb-6">
              <PleaseWaitSpinner fullMessage="Confirming transaction..." />
            </div>
          </Then>
          <Else>
            <div className="mt-14 mb-6">
              <If not={actions.length}>
                <Then>
                  <p>No actions, advisory proposal.</p>
                </Then>
                <Else>
                  <p className="flex-grow text-lg text-neutral-900 font-semibold pb-3">
                    Actions
                  </p>
                  <div className="mb-10">
                    {actions?.map?.((action, i) => (
                      <div
                        className="mb-3"
                        key={`${i}-${action.to}-${action.data}`}
                      >
                        <ActionCard action={action} idx={i} />
                        <Button
                          onClick={() => setActions(actions.toSpliced(i, 1))}
                          variant="critical"
                          className="w-full"
                        >
                          Remove action
                        </Button>
                      </div>
                    ))}
                  </div>
                </Else>
              </If>
              {callRevert && (
                <AlertCard message={callRevert} variant="critical" />
              )}
              <Button
                className="mt-3"
                size="lg"
                variant="primary"
                onClick={() => submitProposal()}
              >
                Submit proposal
              </Button>
            </div>
          </Else>
        </If>
      </div>
    </section>
  );
}
