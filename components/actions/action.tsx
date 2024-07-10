import { ReactNode } from "react";
import { ElseIf, If, Then } from "@/components/if";
import { InputText, Tag } from "@aragon/ods";
import { AddressText } from "@/components/text/address";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { Action } from "@/utils/types";
import { useAction } from "@/hooks/useAction";
import {
  AbiFunction,
  AbiParameter,
  Address,
  Hex,
  decodeAbiParameters,
  formatEther,
  toFunctionSignature,
} from "viem";
import { compactNumber } from "@/utils/numbers";
import { decodeCamelCase } from "@/utils/case";
import { InputValue } from "@/utils/input-values";
import { CCIPDeployments } from "@/crosschain-account/utils/ccip";

type ActionCardProps = {
  action: Action;
  idx: number;
  crossChain?: boolean;
};
type CallParameterFieldType =
  | string
  | number
  | bigint
  | Address
  | Hex
  | boolean
  | CallParameterFieldType[]
  | { [k: string]: CallParameterFieldType };

export const ActionCard = function ({
  action,
  idx,
  crossChain,
}: ActionCardProps) {
  const { isLoading, args, functionName, functionAbi } = useAction(
    action,
    crossChain
  );

  const isEthTransfer = !action.data || action.data === "0x";

  if (isEthTransfer) {
    return (
      <Card>
        <div className="w-full flex flex-row space-x-10 justify-between">
          <div className="w-full flex flex-row space-x-10">
            <div>
              <h3 className="font-semibold">Recipient</h3>
              <p>
                <AddressText>{action.to}</AddressText>
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Transfer</h3>
              <p>{compactNumber(formatEther(action.value))} ETH</p>
            </div>
          </div>
          <Tag label={(idx + 1).toString()} variant="primary"></Tag>
        </div>
      </Card>
    );
  }

  const functionSignature = functionAbi
    ? toFunctionSignature(functionAbi).replace(/,/g, ", ")
    : "";

  const ccipCall = functionSignature.startsWith("ccipSend")
    ? decodeCCIPCall(args)
    : undefined;

  return (
    <Card>
      <div className="w-full flex flex-row space-x-10 justify-between">
        <div>
          <div className="w-full flex flex-row space-x-10">
            <div>
              <h3 className="font-semibold">Contract</h3>
              <p>
                <AddressText>{action.to}</AddressText>
              </p>
            </div>
            <If condition={!isLoading && functionName}>
              <div>
                <h3 className="font-semibold">Action</h3>
                <p className="text-sm text-ellipsis">
                  <code>{functionSignature}</code>
                </p>
              </div>
            </If>
            <If condition={action.value}>
              <div>
                <h3 className="font-semibold">Transfer</h3>
                <p>
                  <span className="font-semibold">
                    {compactNumber(formatEther(action.value))}
                  </span>{" "}
                  ETH{" "}
                </p>
              </div>
            </If>
          </div>
        </div>
        <Tag label={(idx + 1).toString()} variant="primary"></Tag>
      </div>
      <If condition={isLoading}>
        <Then>
          <div className="mt-3">
            <PleaseWaitSpinner status="Loading the details" />
          </div>
        </Then>
        <ElseIf condition={functionSignature.startsWith("performCall")}>
          <div className="mt-3">
            <div>
              <h3 className="font-semibold">Call</h3>
              <div className="grid gap-3 mt-3">
                <ActionCard
                  action={{
                    to: args[0] as Address,
                    value: args[1] as bigint,
                    data: args[2] as Hex,
                  }}
                  idx={0}
                  crossChain={crossChain}
                />
              </div>
            </div>
          </div>
        </ElseIf>
        <ElseIf condition={functionSignature.startsWith("performDelegateCall")}>
          <div className="mt-3">
            <div>
              <h3 className="font-semibold">Delegate Call</h3>
              <div className="grid gap-3 mt-3">
                <ActionCard
                  action={{
                    to: args[0] as Address,
                    value: BigInt(0),
                    data: args[1] as Hex,
                  }}
                  idx={0}
                  crossChain={crossChain}
                />
              </div>
            </div>
          </div>
        </ElseIf>
        <ElseIf condition={functionSignature.startsWith("multicall")}>
          <div className="mt-3">
            <div>
              <h3 className="font-semibold">Multicall</h3>
              <div className="grid gap-3 mt-3">
                {args.map((arg, i) => (
                  <ActionCard
                    idx={i}
                    key={i}
                    action={{
                      to: action.to,
                      value: BigInt(0),
                      data: arg as Hex,
                    }}
                    crossChain={crossChain}
                  />
                ))}
              </div>
            </div>
          </div>
        </ElseIf>
        <ElseIf condition={functionSignature.startsWith("ccipSend")}>
          <div className="mt-3">
            <div>
              <h3 className="font-semibold">CCIP Send</h3>
              {ccipCall && (
                <div className="grid gap-3 mt-3">
                  <span>Chain: {getCCIPChainName(ccipCall.chainSelector)}</span>
                  <span>To: {ccipCall.args.receiver}</span>
                  <span>Paying with: {ccipCall.args.feeToken}</span>
                  <span>
                    Gas limit: {ccipCall.args.extraArgs[0].toString()}
                  </span>
                  {ccipCall.args.tokenAmounts.length !== 0 && (
                    <div>
                      <span>Token transfers:</span>
                      <div className="pl-2">
                        {ccipCall.args.tokenAmounts.map((tokenTransfer) => (
                          <span>
                            <strong>{tokenTransfer[0]}: </strong>
                            {tokenTransfer[1].toString()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {ccipCall.args.data && (
                    <ActionCard
                      action={{
                        to: ccipCall.args.data[0],
                        value: ccipCall.args.data[1],
                        data: ccipCall.args.data[2],
                      }}
                      idx={0}
                      crossChain={true}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </ElseIf>
        <ElseIf condition={args.length}>
          <div className="mt-3">
            <div>
              <h3 className="font-semibold">Action parameters</h3>
              <div className="grid gap-3 mt-3">
                {args.map((arg, i) => (
                  <CallParameterField
                    value={arg}
                    idx={i}
                    key={i}
                    functionAbi={functionAbi}
                  />
                ))}
              </div>
            </div>
          </div>
        </ElseIf>
      </If>
    </Card>
  );
};

// Helpers

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div
      className="p-4 lg:p-6 w-full flex flex-col space-y-6
      box-border border border-neutral-100
      focus:outline-none focus:ring focus:ring-primary
      bg-neutral-0 rounded-xl"
    >
      {children}
    </div>
  );
};

const CallParameterField = ({
  value,
  idx,
  functionAbi,
}: {
  value: CallParameterFieldType;
  idx: number;
  functionAbi: AbiFunction | null;
}) => {
  if (functionAbi?.type !== "function") return <></>;

  const addon = resolveAddon(
    functionAbi.inputs?.[idx].name ?? "",
    functionAbi.inputs?.[idx].type,
    idx
  );

  return (
    <InputText
      className="w-full"
      addon={decodeCamelCase(addon)}
      value={resolveValue(value, functionAbi.inputs?.[idx])}
      readOnly
      addonPosition="left"
    />
  );
};

function resolveValue(
  value: CallParameterFieldType,
  abi?: AbiParameter
): string {
  if (value === undefined) {
    return "Unknown";
  }
  if (!abi?.type) {
    if (Array.isArray(value)) return value.join(", ");
    return value.toString();
  } else if (abi.type === "tuple[]") {
    const abiClone = Object.assign({}, { ...abi });
    abiClone.type = abiClone.type.replace(/\[\]$/, "");

    const items = (value as any as any[]).map((item) =>
      resolveValue(item, abiClone)
    );
    return items.join(", ");
  } else if (abi.type === "tuple") {
    const result = {} as Record<string, string>;
    const components: AbiParameter[] = (abi as any).components || [];

    for (let i = 0; i < components.length; i++) {
      console.log("component", i, components[i]);
      let k = components[i].name;
      if (!k) {
        k = i.toString(); // Needs to be a unique key as it will create an object (otherwise overwrite)
      }
      result[k] = resolveValue((value as any)[k], components[i]);
    }

    return getReadableJson(result);
  } else if (abi.type.endsWith("[]")) {
    return (value as any as any[]).join(", ");
  } else if (abi.type === "address") {
    return value as string;
  } else if (abi.type === "bytes32") {
    return value as string;
  } else if (abi.type.startsWith("uint") || abi.type.startsWith("int")) {
    return value.toString();
  } else if (abi.type.startsWith("bool")) {
    return value ? "Yes" : "No";
  }
  return value.toString();
}

function resolveAddon(
  name: string,
  abiType: string | undefined,
  idx: number
): string {
  if (name) return name;
  else if (abiType) {
    if (abiType === "tuple") {
      return "Tuple";
    } else if (abiType === "address") {
      return "Address";
    } else if (abiType === "bytes32") {
      return "Identifier";
    } else if (abiType === "bytes") {
      return "Data";
    } else if (abiType === "string") {
      return "Text";
    } else if (abiType.startsWith("uint") || abiType.startsWith("int")) {
      return "Number";
    } else if (abiType.startsWith("bool")) {
      return "Boolean";
    }
  }
  return (idx + 1).toString();
}

function getReadableJson(value: Record<string, InputValue>): string {
  const items = Object.keys(value).map((k) => k + ": " + value[k]);

  return "{ " + items.join(", ") + " }";
}

function decodeCCIPCall(args: any[]) {
  const ccipArgs = args[1] as [Hex, Hex, [Address, bigint][], Address, Hex];
  return {
    chainSelector: args[0] as bigint,
    args: {
      receiver: decodeAbiParameters([{ type: "address" }], ccipArgs[0]),
      data:
        ccipArgs[1] === "0x"
          ? undefined
          : decodeAbiParameters(
              [
                { type: "address", name: "to" },
                { type: "uint256", name: "value" },
                { type: "bytes", name: "data" },
              ],
              ccipArgs[1]
            ),
      tokenAmounts: ccipArgs[2],
      feeToken: ccipArgs[3],
      extraArgs: decodeAbiParameters(
        [{ type: "uint256", name: "gasLimit" }],
        ccipArgs[4].replace("0x97a657c9", "0x") as Hex
      ),
    },
  };
}

function getCCIPChainName(chainSelector: bigint): string {
  const chainId = Object.keys(CCIPDeployments).find(
    (chainId) =>
      CCIPDeployments[chainId as any as keyof typeof CCIPDeployments]
        .chainSelector === chainSelector
  );
  if (chainId === undefined) {
    return `CCIP:${chainSelector}`;
  }

  switch (chainId) {
    case "1":
      return "Ethereum";
    default:
      return chainId;
  }
  // const chain = chains.find((c) => c.id === Number(chainId));
  // if (!chain) {
  //   return chainId;
  // }

  // return chain.name;
}
