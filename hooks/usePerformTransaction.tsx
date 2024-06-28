import { useState } from "react";
import {
  Loggers,
  performTransaction as performTransactionInternal,
  PerformTransactionParameters,
} from "@plopmenz/viem-extensions";
import {
  type Abi,
  type Account,
  type Chain,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type PublicClient,
  type RpcSchema,
  type Transport,
  type WalletClient,
} from "viem";
import { usePublicClient, useWalletClient } from "wagmi";

import { useAlerts } from "@/context/Alerts";

export interface usePerformTransactionProps {
  chainId?: number;
}

export function usePerformTransaction(props: usePerformTransactionProps) {
  const { data: walletClient } = useWalletClient({ chainId: props.chainId });
  const publicClient = usePublicClient({ chainId: props.chainId });
  const { addAlert } = useAlerts();

  let dismiss = () => {};
  const loggers: Loggers = {
    onError: (item) => {
      console.error(`${item.title}: ${item.description}\n${item.error}`);
      addAlert(item.title, {
        description: item.description,
        type: "error",
      });
    },
    onUpdate: (item) => {
      console.log(`${item.title}: ${item.description}`);
      addAlert(item.title, {
        description: item.description,
        type: "info",
      });
    },
    onSuccess: (item) => {
      console.log(`${item.title}: ${item.description}`);
      addAlert(item.title, {
        description: item.description,
        type: "success",
      });
    },
  };

  const [performingTransaction, setPerformingTransaction] =
    useState<boolean>(false);
  async function performTransaction<
    abi extends Abi | readonly unknown[] = Abi,
    functionName extends ContractFunctionName<
      abi,
      "nonpayable" | "payable"
    > = ContractFunctionName<abi, "nonpayable" | "payable">,
    args extends ContractFunctionArgs<
      abi,
      "nonpayable" | "payable",
      functionName
    > = ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
    chain extends Chain = Chain,
    account extends Account = Account,
    pcTransport extends Transport = Transport,
    pcAccountOrAddress extends Account | undefined = undefined,
    pcRpcSchema extends RpcSchema | undefined = undefined,
    wcTransport extends Transport = Transport,
    wcRpcSchema extends RpcSchema | undefined = undefined,
  >(
    params: PerformTransactionParameters<
      abi,
      functionName,
      args,
      chain,
      account,
      pcTransport,
      pcAccountOrAddress,
      pcRpcSchema,
      wcTransport,
      wcRpcSchema
    >
  ) {
    if (performingTransaction) {
      loggers.onError?.({
        title: "Please wait",
        description: "The past transaction is still running.",
      });
      return;
    }
    setPerformingTransaction(true);
    await performTransactionInternal<
      abi,
      functionName,
      args,
      chain,
      account,
      pcTransport,
      pcAccountOrAddress,
      pcRpcSchema,
      wcTransport,
      wcRpcSchema
    >({
      loggers: loggers,
      publicClient: publicClient as PublicClient<
        pcTransport,
        chain,
        pcAccountOrAddress,
        pcRpcSchema
      >,
      walletClient: walletClient as any as WalletClient<
        wcTransport,
        chain,
        account,
        wcRpcSchema
      >,
      ...params,
    }).catch(console.error);
    setPerformingTransaction(false);
  }

  return { performTransaction, performingTransaction, dismiss, loggers };
}
