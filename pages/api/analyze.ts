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

    const fetchTransfers = async (direction: "fromAddress" | "toAddress") => {
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
              [direction]: address,
              category: ["external", "internal", "erc20"],
              withMetadata: false,
              excludeZeroValue: true,
              maxCount: "0x3e8"
            }
          ]
        })
      });

      const data = await response.json();
      return data?.result?.transfers || [];
    };

    const [sent, received] = await Promise.all([
      fetchTransfers("fromAddress"),
      fetchTransfers("toAddress")
    ]);

    const txCount = sent.length + received.length;
    const finalScore = txCount;

    let category = "🦐 Shrimp";
    if (finalScore >= 1000) category = "🐋 Mega Whale";
    else if (finalScore >= 100) category = "🐳 Whale";
    else if (finalScore >= 25) category = "🐬 Dolphin";

    return res.status(200).json({
      address,
      sentCount: sent.length,
      receivedCount: received.length,
      txCount,
      finalScore,
      category
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Alchemy fetch failed" });
  }
}
