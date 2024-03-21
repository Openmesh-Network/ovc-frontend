import { toHex } from "viem";
import {
  deploymentPublicClient as publicClient,
  deploymentWalletClient as walletClient,
} from "./lib/util/client";
import { deploymentAccount as account } from "./lib/util/account";
import { DelegateAnnouncerAbi } from "../plugins/delegateAnnouncer/artifacts/DelegateAnnouncer.sol";

async function main() {
  console.log("Emitting delegation event");
  const DAO = "0x86cbB36e65cdC0502A502D5e6E02130d93da927E";
  const message = "Delegating your whale balance is a great idea";

  const { request } = await publicClient.simulateContract({
    address: "0xa119833aba78d4639c6ce6c2fe3ca4c7de02d710",
    abi: DelegateAnnouncerAbi,
    functionName: "announceDelegation",
    args: [DAO, toHex(message)],
    account,
  });
  const hash = await walletClient.writeContract(request);

  console.log("  - Waiting for transaction (" + hash + ")");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt) {
    throw new Error(
      "The Dual Governance plugin repository could not be created"
    );
  }

  console.log("Done");
}

main();
