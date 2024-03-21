import { formatHexString } from "@/utils/evm";
import { getChildrenText } from "@/utils/content";
import { ReactNode, useState, useEffect } from "react";
import { usePublicClient } from 'wagmi'
// import { Link } from '@aragon/ods'

export const TransactionText = ({ children }: { children: ReactNode }) => {
  const txHash = getChildrenText(children);
  const client = usePublicClient()
  const [link, setLink] = useState<string>();

  useEffect(() => {
    if (!client) return;
    
    setLink(client.chain.blockExplorers?.default.url + "/tx/" + txHash)
  }, [txHash, client])
  
  const formattedHexValue = formatHexString(txHash.trim());
  if (!link) {
    return (
      <span className="text-primary-400 font-semibold underline">{formattedHexValue}</span>
    );
  }
  return (
    <>
      {/**
        <Link href={link} iconRight="LINK_EXTERNAL">
          {formattedHexValue}
        </Link>
     */}
      <a href={link} target="_blank" className="text-primary-400 font-semibold underline">
        {formattedHexValue}
      </a>
    </>
  );
};
