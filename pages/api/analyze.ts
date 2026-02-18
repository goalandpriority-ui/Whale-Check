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
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            fromAddress: address,
            category: ["external", "internal", "erc20"],
            withMetadata: false,
            excludeZeroValue: true,
            maxCount: "0x3e8"
          }
        ]
      })
    });

    const data = await response.json();

    const transfers = data?.result?.transfers || [];

    const txCount = transfers.length;

    const finalScore = txCount;

    let category = "🦐 Shrimp";
    if (finalScore >= 15) category = "🐋 Big Whale";
    else if (finalScore >= 10) category = "🐳 Whale";
    else if (finalScore >= 5) category = "🐬 Dolphin";

    return res.status(200).json({
      address,
      txCount,
      finalScore,
      category
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Alchemy fetch failed" });
  }
}
