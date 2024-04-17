import { FC, useState } from "react";
import { encodeFunctionData, isAddress } from "viem";
import { Button, InputText } from "@aragon/ods";
import { Action } from "@/utils/types";
import { VerifiedContributorContract } from "@/ovc-indexer/contracts/VerifiedContributor";

interface InputMintOVCProps {
  onAddActions: (actions: Action[]) => any;
}
export const InputMintOVC: FC<InputMintOVCProps> = ({ onAddActions }) => {
  const [mintTo, setMintTo] = useState<string>("");

  const actionEntered = () => {
    if (!mintTo || !isAddress(mintTo)) {
      console.error(`Invalid value for mintTo: ${mintTo}`);
      return;
    }

    const random = crypto.getRandomValues(new Uint8Array(32)); // 32 * 8 = 256
    const nftId = random.reduce(
      (acc, byte) => acc + byte.toString(16).padStart(2, "0"), // Every byte (256) takes 2 hex characters
      "0x"
    );

    onAddActions([
      {
        to: VerifiedContributorContract.address,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: VerifiedContributorContract.abi,
          functionName: "mint",
          args: [mintTo, BigInt(nftId)],
        }),
      },
    ]);
    setMintTo("");
  };

  return (
    <div className="my-6">
      <div className="mb-3">
        <InputText
          label="Mint to"
          placeholder="0x1234..."
          variant={!mintTo || isAddress(mintTo) ? "default" : "critical"}
          value={mintTo}
          onChange={(e) => setMintTo(e.target.value || "")}
        />
      </div>
      <Button onClick={actionEntered}>Add action</Button>
    </div>
  );
};
