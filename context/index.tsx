import { AlertProvider } from "./Alerts";
import { ReactNode } from "react";
import { QueryClient } from "@tanstack/react-query";
import { config, projectId } from "@/config/wagmi-config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { State, WagmiProvider, deserialize, serialize } from "wagmi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createAsyncStoragePersister({
  serialize,
  storage: AsyncStorage,
  deserialize,
});

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableOnramp: true,
});

export function RootContextProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <AlertProvider>{children}</AlertProvider>
      </PersistQueryClientProvider>
    </WagmiProvider>
  );
}
