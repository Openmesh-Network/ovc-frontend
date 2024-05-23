"use client";

import { useState } from "react";

import { useSignMessage, useVerifyMessage } from "wagmi";
import { Button, InputText } from "@aragon/ods";
import { isAddress, isHex } from "viem";
import { defaultChain } from "@/config/wagmi-config";

type VerifyMessageProps = {
  defaultMessage: string;
  defaultSigner: string;
  defaultSignature: string;
};
export function VerifyMessage({
  defaultMessage,
  defaultSigner,
  defaultSignature,
}: VerifyMessageProps) {
  const [message, setMessage] = useState<string>(defaultMessage);
  const [signer, setSigner] = useState<string>(defaultSigner);
  const [signature, setSignature] = useState<string>(defaultSignature);
  const {
    data: valid,
    error,
    refetch,
  } = useVerifyMessage({
    chainId: defaultChain.id,
    address: isAddress(signer) ? signer : undefined,
    message: message,
    signature: isHex(signature) ? signature : undefined,
  });

  return (
    <div>
      <span>Message:</span>
      <InputText value={message} onChange={(e) => setMessage(e.target.value)} />
      <br />
      <span>Signer:</span>
      <InputText
        value={signer}
        onChange={(e) => setSigner(e.target.value)}
        variant={isAddress(signer) ? "default" : "critical"}
      />
      <br />
      <span>Signature:</span>
      <InputText
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
        variant={isHex(signer) ? "default" : "critical"}
      />
      <br />
      {error !== null && <p>Error: {error.message}</p>}
      {valid !== undefined && (
        <p>
          Signature is:{" "}
          {valid ? (
            <a style={{ color: "green" }}>Valid</a>
          ) : (
            <a style={{ color: "red" }}>Invalid</a>
          )}
        </p>
      )}
    </div>
  );
}
