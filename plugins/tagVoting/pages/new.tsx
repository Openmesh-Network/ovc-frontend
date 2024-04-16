import {
  AlertCard,
  Button,
  InputText,
  TextAreaRichText,
  Toggle,
  ToggleGroup,
} from "@aragon/ods";
import React, { useEffect, useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
  Address,
  Hash,
  Hex,
  encodeAbiParameters,
  encodeFunctionData,
  keccak256,
  parseAbiItem,
  toBytes,
  toHex,
  zeroHash,
} from "viem";
import { useAlerts } from "@/context/Alerts";
import { FunctionCallForm } from "@/components/input/function-call-form";
import { Action } from "@/utils/types";
import { getPlainText } from "@/utils/html";
import { useRouter } from "next/router";
import { Else, If, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { ActionCard } from "@/components/actions/action";
import { TagVotingContract } from "@/ovc-indexer/contracts/TagVoting";
import { AddToIpfsRequest, AddToIpfsResponse } from "@/pages/api/addToIpfs";
import axios from "axios";
import { SmartAccountContract } from "@/contracts/SmartAccount";
import { departments } from "@/ovc-indexer/contracts/departments";
import { CCIPDeployments } from "@/crosschain-account/utils/ccip";
import {
  crosschainAccountChain,
  crosschainAccountPublicClient,
  defaultChain,
  defaultPublicClient,
} from "@/config/wagmi-config";
import { RouterContract } from "@/contracts/Router";
import { CrossChainAccountContract } from "@/contracts/CrossChainAccount";
import { DAOContract } from "@/contracts/DAO";

enum Options {
  CrosschainExecution = "crosschainExecution",
  DirectDAO = "directDAO",
}

export default function Create({
  plugin,
  tag,
}: {
  plugin: Address;
  tag: Hash;
}) {
  const { push } = useRouter();
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
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
      push(`#/${tag}/`);
    }, 1000 * 2);
  }, [status, createTxHash, isConfirming, isConfirmed]);

  useEffect(() => {
    const department = departments.find((department) => department.tag === tag);
    if (!department) {
      setCallRevert(
        `Department with tag ${tag} not found. Cannot simulate transaction.`
      );
      return;
    }
    defaultPublicClient
      .simulateContract({
        account: department.dao.tagVoting,
        abi: DAOContract.abi,
        address: department.dao.dao,
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

    if (!actions.length || !actions[0].data || actions[0].data === "0x") {
      return addAlert("Invalid proposal details", {
        description:
          "Please ensure that the values of the action to execute are complete and correct",
        type: "error",
      });
    }

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
      `Successfully uploaded tag voting proposal metadata to ${metadata}.`
    );
    const failureMap = BigInt(0);
    const startDate = BigInt(0);
    const endDate = BigInt(0);
    const voteOption = 0;
    const tryEarlyExecution = false;
    createProposalWrite({
      abi: TagVotingContract.abi,
      address: plugin,
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
          <ToggleGroup
            isMultiSelect={true}
            value={options}
            onChange={(newOptions) => setOptions(newOptions ?? [])}
          >
            <Toggle
              label="Execute on Ethereum"
              value={Options.CrosschainExecution}
            />
          </ToggleGroup>
          <div className="mb-6">
            <FunctionCallForm
              publicClient={
                options.includes(Options.CrosschainExecution)
                  ? crosschainAccountPublicClient
                  : defaultPublicClient
              }
              onAddAction={async (action) =>
                setActions(
                  actions.concat([await applyOptions(action, options, tag)])
                )
              }
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
                  <p>Add the first action to continue</p>
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
                disabled={!actions.length}
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

async function applyOptions(
  action: Action,
  options: string[],
  tag: Hash
): Promise<Action> {
  const department = departments.find((department) => department.tag === tag);
  if (!department) {
    throw new Error(
      "Department not found, but required for wrapping the proposal actions."
    );
  }
  if (options.includes(Options.CrosschainExecution)) {
    action = {
      to: department.smart_account,
      value: BigInt(0),
      data: encodeFunctionData({
        abi: SmartAccountContract.abi,
        functionName: "performCall",
        args: [action.to, action.value, action.data],
      }),
    };
    const message = encodeAbiParameters(
      [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
      ],
      [action.to, action.value, action.data]
    );
    // const response = await crosschainAccountPublicClient.transport.request({
    //   method: "eth_call",
    //   params: [
    //     {
    //       from: CCIPDeployments[crosschainAccountChain.id].router,
    //       data: encodeFunctionData({
    //         abi: CrossChainAccountContract.abi,
    //         functionName: "ccipReceive",
    //         args: [
    //           {
    //             messageId: zeroHash,
    //             sourceChainSelector:
    //               CCIPDeployments[defaultChain.id].chainSelector,
    //             sender: department.smart_account,
    //             data: message,
    //             destTokenAmounts: [],
    //           },
    //         ],
    //       }),
    //       to: department.crosschain_account,
    //     },
    //     "latest",
    //     {
    //       [CCIPDeployments[crosschainAccountChain.id].router]: {
    //         balance: toHex(parseEther("1")),
    //       },
    //     },
    //   ],
    // });
    const bytecode = await crosschainAccountPublicClient.getBytecode({
      address: department.crosschain_account,
    });
    if (!bytecode) {
      throw new Error(
        `No bytecode for ${department.crosschain_account} found.`
      );
    }
    const fakeRouter = "0xaF7E68bCb2Fc7295492A00177f14F59B92814e70";
    const { request } = await crosschainAccountPublicClient.simulateContract({
      // account: CCIPDeployments[crosschainAccountChain.id].router,
      account: fakeRouter,
      address: department.crosschain_account,
      abi: CrossChainAccountContract.abi,
      functionName: "ccipReceive",
      args: [
        {
          messageId: zeroHash,
          sourceChainSelector: CCIPDeployments[defaultChain.id].chainSelector,
          sender: department.smart_account,
          data: message,
          destTokenAmounts: [],
        },
      ],
      stateOverride: [
        {
          address: department.crosschain_account,
          // Router is stored as immutable variable inside of the contract code
          code: bytecode.replace(
            CCIPDeployments[crosschainAccountChain.id].router
              .replace("0x", "")
              .toLowerCase(),
            fakeRouter.replace("0x", "")
          ) as Hex,
        },
      ],
    });
    console.log(request);
    const gas = await crosschainAccountPublicClient
      .estimateContractGas({
        account: CCIPDeployments[crosschainAccountChain.id].router,
        address: department.crosschain_account,
        abi: CrossChainAccountContract.abi,
        functionName: "ccipReceive",
        args: [
          {
            messageId: zeroHash,
            sourceChainSelector: CCIPDeployments[defaultChain.id].chainSelector,
            sender: department.smart_account,
            data: message,
            destTokenAmounts: [],
          },
        ],
      })
      .catch((error) => {
        throw new Error(`CCIP gas estimation error: ${error}`);
      });
    action = {
      to: CCIPDeployments[defaultChain.id].router,
      value: BigInt(0),
      data: encodeFunctionData({
        abi: RouterContract.abi,
        functionName: "ccipSend",
        args: [
          CCIPDeployments[crosschainAccountChain.id].chainSelector,
          {
            receiver: department.crosschain_account,
            data: message,
            tokenAmounts: [],
            feeToken: CCIPDeployments[defaultChain.id].feeTokens.link,
            extraArgs: encodeAbiParameters(
              [
                { type: "bytes4", name: "selector" },
                { type: "uint256", name: "gasLimit" },
              ],
              [
                keccak256(toBytes("CCIP EVMExtraArgsV1")).substring(
                  0,
                  10
                ) as Hex,
                BigInt(gas),
              ]
            ),
          },
        ],
      }),
    };
  }

  if (!options.includes(Options.DirectDAO)) {
    action = {
      to: department.smart_account,
      value: BigInt(0),
      data: encodeFunctionData({
        abi: SmartAccountContract.abi,
        functionName: "performCall",
        args: [action.to, action.value, action.data],
      }),
    };
  }

  return action;
}
