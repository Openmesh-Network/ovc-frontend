"use client";

import { useState } from "react";

import { useSignMessage } from "wagmi";
import { Button, InputText } from "@aragon/ods";

type SignMessageProps = {
  defaultMessage: string;
};
export function SignMessage({ defaultMessage }: SignMessageProps) {
  const [message, setMessage] = useState<string>(defaultMessage);
  const { data: signed, error, signMessageAsync } = useSignMessage();

  return (
    <div>
      <span>Message:</span>
      <InputText value={message} onChange={(e) => setMessage(e.target.value)} />
      <br />
      <Button
        onClick={() => {
          signMessageAsync({ message: message })?.catch(console.error);
        }}
      >
        Sign
      </Button>
      <br />
      {error !== null && <p>Error: {error.message}</p>}
      {signed && <p>Signed message: {signed}</p>}
    </div>
  );
}
