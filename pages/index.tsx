import { Button, IllustrationHuman } from "@aragon/ods";
import { ReactNode } from "react";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Else, If, Then } from "@/components/if";

export default function Home() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <main className="w-screen max-w-full flex-col">
      <Card>
        <h1 className="text-2xl font-[700] text-neutral-800">
          Welcome to the Openmesh Verified Contributor Dashboard!
        </h1>
        <p className="text-md text-neutral-400">
          Here you can participate in Openmesh Governance as Verified
          Contributor. This includes all department DAOs. <br /> Do note that
          you will only be able to governs DAOs you are a member of.
        </p>
        <div className="">
          <IllustrationHuman
            className="max-w-96 mx-auto mb-10"
            body="VOTING"
            expression="SMILE"
            hairs="COOL"
          />
          <div className="flex justify-center">
            <If condition={isConnected}>
              <Then>
                <></>
              </Then>
              <Else>
                <Button size="md" variant="primary" onClick={() => open()}>
                  <span>Connect wallet</span>
                </Button>
              </Else>
            </If>
          </div>
        </div>
      </Card>
    </main>
  );
}

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div
      className="w-full flex flex-col space-y-6
    box-border border border-neutral-100
    focus:outline-none focus:ring focus:ring-primary
    px-4 py-5 xs:px-10 md:px-6 lg:px-7 mb-6
    bg-neutral-0 rounded-xl"
    >
      {children}
    </div>
  );
};
