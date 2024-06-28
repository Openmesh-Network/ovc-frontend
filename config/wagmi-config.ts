import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { polygon, mainnet, sepolia } from "wagmi/chains";

import { siteConfig } from "./site";
import { createPublicClient, http } from "viem";

export const appName = siteConfig.name;
export const appDescription = siteConfig.description;
export const appIcon = "https://ovc.openmesh.network/icon.png" as const;
export const appUrl = "https://ovc.openmesh.network" as const;
const metadata = {
  name: appName,
  description: appDescription,
  url: appUrl,
  icons: [appIcon],
};

export const projectId = "29c0627adb790bf289f42c4616efbce0" as const;
export const chains = [polygon, sepolia] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  batch: { multicall: true },
  transports: {
    [polygon.id]: http("https://polygon-rpc.com"),
    [sepolia.id]: http("https://rpc2.sepolia.org"),
  },
});

export const defaultChain = polygon;
export const defaultPublicClient = createPublicClient({
  chain: defaultChain,
  transport: http("https://polygon-rpc.com"),
});

export const crosschainAccountChain = mainnet;
export const crosschainAccountPublicClient = createPublicClient({
  chain: crosschainAccountChain,
  transport: http(),
});
