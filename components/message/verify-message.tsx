"use client";

import { useEffect, useState } from "react";

import { useVerifyMessage } from "wagmi";
import { InputText } from "@aragon/ods";
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
  const [base64, setBase64] = useState<string>("");
  const [signer, setSigner] = useState<string>(defaultSigner);
  const [signature, setSignature] = useState<string>(defaultSignature);
  const { data: valid, error } = useVerifyMessage({
    chainId: defaultChain.id,
    address: isAddress(signer) ? signer : undefined,
    message: base64,
    signature: isHex(signature) ? signature : undefined,
  });

  useEffect(() => {
    if (!message) {
      return;
    }

    const newBase64 = Buffer.from(message).toString("base64");
    if (base64 !== newBase64) {
      setBase64(newBase64);
    }
  }, [message]);

  useEffect(() => {
    if (!base64) {
      return;
    }

    const newMessage = Buffer.from(base64, "base64").toString();
    if (message !== newMessage) {
      setMessage(newMessage);
    }
  }, [base64]);

  return (
    <div>
      <span>Message:</span>
      <InputText value={message} onChange={(e) => setMessage(e.target.value)} />
      <br />
      <span>Base64:</span>
      <InputText value={base64} onChange={(e) => setBase64(e.target.value)} />
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
