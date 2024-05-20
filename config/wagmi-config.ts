import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { polygon, mainnet } from "wagmi/chains";

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

export const projectId = "0ec5e8af894898c29bc27a1c4dc11e78" as const;
export const chains = [polygon] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const defaultChain = polygon;
export const defaultPublicClient = createPublicClient({
  chain: defaultChain,
  transport: http(),
});

export const crosschainAccountChain = mainnet;
export const crosschainAccountPublicClient = createPublicClient({
  chain: crosschainAccountChain,
  transport: http(),
});
