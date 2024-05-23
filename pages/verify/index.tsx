import { ReactNode } from "react";
import { VerifyMessage } from "@/components/message/verify-message";

export default function VerifyPage() {
  return (
    <main className="w-screen max-w-full flex-col">
      <Card>
        <h1 className="text-2xl font-[700] text-neutral-800">Verify Message</h1>
        <VerifyMessage
          defaultMessage="Verified Contributor Id 0 is granted to Samuel Mens."
          defaultSigner="0x519ce4C129a981B2CBB4C3990B1391dA24E8EbF3"
          defaultSignature="0x2fa7b4b4256e77cdcac173eb142621fb8ff64caf53c1ad331928cafa1df8f41e1de2d4c7b2a5f3cc9d58af80a57716116d83f0d670ac3d54e2757253a0871b681b"
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
