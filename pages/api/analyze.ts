import type { NextApiRequest, NextApiResponse } from "next";

const BASESCAN_API = "https://api.etherscan.io/v2/api";
const CHAIN_ID = 8453; // Base Mainnet

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { address } = req.query;

    if (!address || typeof address !== "string") {
      return res.status(400).json({ error: "Address required" });
    }

    const apiKey = process.env.BASESCAN_API_KEY;

    const buildUrl = (action: string) =>
      `${BASESCAN_API}?chainid=${CHAIN_ID}&module=account&action=${action}&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

    const normal = await fetch(buildUrl("txlist")).then(r => r.json());
    const internal = await fetch(buildUrl("txlistinternal")).then(r => r.json());
    const token = await fetch(buildUrl("tokentx")).then(r => r.json());

    const normalTx = normal.status === "1" ? normal.result : [];
    const internalTx = internal.status === "1" ? internal.result : [];
    const tokenTx = token.status === "1" ? token.result : [];

    const finalScore =
      normalTx.length * 1 +
      internalTx.length * 1 +
      tokenTx.length * 2;

    let category = "🦐 Shrimp";

    if (finalScore >= 15) {
      category = "🐋 Big Whale";
    } else if (finalScore >= 10) {
      category = "🐳 Whale";
    } else if (finalScore >= 5) {
      category = "🐬 Dolphin";
    }

    return res.status(200).json({
      address,
      normalTxCount: normalTx.length,
      internalTxCount: internalTx.length,
      tokenTxCount: tokenTx.length,
      finalScore,
      category,
    });

  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch Base wallet data" });
  }
}
