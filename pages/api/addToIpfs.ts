import type { NextApiRequest, NextApiResponse } from "next";

import { addToIpfs } from "@/ovc-indexer/openrd-indexer/utils/ipfs";

export interface AddToIpfsRequest {
  json: string;
}

export interface AddToIpfsResponse {
  cid: string;
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const params = req.body as AddToIpfsRequest;
    const response = await addToIpfs(params.json);
    res.status(200);
    return res.json({ cid: response });
  } catch (error: any) {
    res.status(500);
    return res.json({ error: error?.message ?? JSON.stringify(error) });
  }
}
