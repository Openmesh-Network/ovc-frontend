import type { NextApiRequest, NextApiResponse } from "next";

import { fetchMetadata } from "@/ovc-indexer/openrd-indexer/utils/metadata-fetch";

export interface FetchMetadataRequest {
  url: string;
}

export interface FetchMetadataResponse {
  content: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const params = req.body as FetchMetadataRequest;
    const response = await fetchMetadata(params.url);
    res.status(200);
    return res.json({ content: response });
  } catch (error: any) {
    res.status(500);
    return res.json({ error: error?.message ?? JSON.stringify(error) });
  }
}
