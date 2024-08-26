import { FC, useState } from "react";
import {
  Hex,
  encodeAbiParameters,
  encodeFunctionData,
  isAddress,
  maxUint256,
  parseAbi,
  parseUnits,
} from "viem";
import { Button, InputText } from "@aragon/ods";
import { Action } from "@/utils/types";
import { CCIPDeployments } from "@/crosschain-account/utils/ccip";
import { crosschainAccountChain, defaultChain } from "@/config/wagmi-config";
import { RouterContract } from "@/contracts/Router";

interface InputTokenBridgeProps {
  onAddActions: (actions: Action[]) => any;
}
export const InputTokenBridge: FC<InputTokenBridgeProps> = ({
  onAddActions,
}) => {
  const [token] = useState<string>(
    "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" // USDC
    // CCIPDeployments[defaultChain.id].feeTokens.link
  );
  const [bridgeTo, setBridgeTo] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const actionEntered = () => {
    if (!token || !isAddress(token)) {
      console.error(`Invalid value for token: ${token}`);
      return;
    }

    if (!bridgeTo || !isAddress(bridgeTo)) {
      console.error(`Invalid value for bridgeTo: ${bridgeTo}`);
      return;
    }

    let amountBigint: bigint;
    try {
      amountBigint = parseUnits(amount, 6);
    } catch {
      console.error(`Invalid value for amount: ${amount}`);
      return;
    }

    const extraArgsVersion = "0x97a657c9"; // bytes4(keccak256("CCIP EVMExtraArgsV1"))
    const action = {
      to: CCIPDeployments[defaultChain.id].router,
      value: BigInt(0),
      data: encodeFunctionData({
        abi: RouterContract.abi,
        functionName: "ccipSend",
        args: [
          CCIPDeployments[crosschainAccountChain.id].chainSelector,
          {
            receiver: encodeAbiParameters([{ type: "address" }], [bridgeTo]),
            data: "0x",
            tokenAmounts: [
              {
                token: token,
                amount: amountBigint,
              },
            ],
            feeToken: CCIPDeployments[defaultChain.id].feeTokens.link,
            extraArgs: (extraArgsVersion +
              encodeAbiParameters(
                [{ type: "uint256", name: "gasLimit" }],
                [BigInt(0)] // https://docs.chain.link/ccip/tutorials/cross-chain-tokens#transferring-tokens-and-pay-in-link
              ).replace("0x", "")) as Hex,
          },
        ],
      }),
    };
    const approveLink = {
      to: CCIPDeployments[defaultChain.id].feeTokens.link,
      value: BigInt(0),
      data: encodeFunctionData({
        abi: parseAbi(["function approve(address spender, uint256 amount)"]),
        functionName: "approve",
        args: [CCIPDeployments[defaultChain.id].router, maxUint256],
      }),
    };
    const approveToken = {
      to: token,
      value: BigInt(0),
      data: encodeFunctionData({
        abi: parseAbi(["function approve(address spender, uint256 amount)"]),
        functionName: "approve",
        args: [CCIPDeployments[defaultChain.id].router, amountBigint],
      }),
    };

    onAddActions([approveLink, approveToken, action]);
    setBridgeTo("");
    setAmount("");
  };

  return (
    <div className="my-6">
      <div className="mb-3">
        <InputText
          label={`Amount of tokens`}
          placeholder="123.45"
          variant={
            !amount || !Number.isNaN(Number(amount)) ? "default" : "critical"
          }
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <InputText
          label="Receiver address (Ethereum)"
          placeholder="0x1234..."
          variant={!bridgeTo || isAddress(bridgeTo) ? "default" : "critical"}
          value={bridgeTo}
          onChange={(e) => setBridgeTo(e.target.value || "")}
        />
      </div>
      <Button onClick={actionEntered}>Add action</Button>
    </div>
  );
};
