import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { address } = req.query;

    if (!address || typeof address !== "string") {
      return res.status(400).json({ error: "Address required" });
    }

    const apiKey = process.env.ALCHEMY_API_KEY;
    const rpcUrl = `https://base-mainnet.g.alchemy.com/v2/${apiKey}`;

    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getTransactionCount",
        params: [address, "latest"]
      })
    });

    const data = await response.json();

    const txCount = parseInt(data.result, 16); // hex → decimal

    let category = "🦐 Shrimp";
    if (txCount >= 2000) category = "🐋 Mega Whale";
    else if (txCount >= 500) category = "🐳 Whale";
    else if (txCount >= 100) category = "🐬 Dolphin";

    return res.status(200).json({
      address,
      txCount,
      category
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "RPC fetch failed" });
  }
}
