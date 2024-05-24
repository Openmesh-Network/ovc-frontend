import { ReactNode } from "react";
import { VerifyMessage } from "@/components/message/verify-message";

export default function VerifyPage() {
  return (
    <main className="w-screen max-w-full flex-col">
      <Card>
        <h1 className="text-2xl font-[700] text-neutral-800">Verify Message</h1>
        <VerifyMessage
          defaultMessage={`Verified Contributor Id 0 is hereby known by the DAO to be granted to "Samuel Mens".`}
          defaultSigner="0x519ce4C129a981B2CBB4C3990B1391dA24E8EbF3"
          defaultSignature="0x2a5f374e63dc66742c170cc7ebe1fe5814dfe13f5ed77f062d614d305226b84949ef497380504c0ed15e32a175f28ba477de0c4968df32b09e896c15cc1b19f21b"
        />
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
