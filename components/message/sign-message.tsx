"use client";

import { useEffect, useState } from "react";

import { useSignMessage } from "wagmi";
import { Button, InputText } from "@aragon/ods";

type SignMessageProps = {
  defaultMessage: string;
};
export function SignMessage({ defaultMessage }: SignMessageProps) {
  const [message, setMessage] = useState<string>(defaultMessage);
  const [base64, setBase64] = useState<string>("");
  const { data: signed, error, signMessageAsync } = useSignMessage();

  useEffect(() => {
    setBase64(Buffer.from(message).toString("base64"));
  }, [message]);

  return (
    <div>
      <span>Message:</span>
      <InputText value={message} onChange={(e) => setMessage(e.target.value)} />
      {base64 && <p>Base64: {base64}</p>}
      <br />
      <Button
        onClick={() => {
          signMessageAsync({ message: base64 })?.catch(console.error);
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
