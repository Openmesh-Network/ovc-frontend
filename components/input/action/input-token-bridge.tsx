import { FC, useState } from "react";
import {
  Hex,
  encodeAbiParameters,
  encodeFunctionData,
  isAddress,
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
    CCIPDeployments[defaultChain.id].feeTokens.link
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
      amountBigint = parseUnits(amount, 18);
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

    onAddActions([action]);
    setBridgeTo("");
    setAmount("");
  };

  return (
    <div className="my-6">
      <div className="mb-3">
        <InputText
          label={`Amount of LINK`}
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
          label="Bridge to (Ethereum)"
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
