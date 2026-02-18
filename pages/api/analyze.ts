import type { NextApiRequest, NextApiResponse } from "next";

const BASESCAN_API = "https://api.basescan.org/api";

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

    // 🔹 Normal Transactions
    const normal = await fetch(
      `${BASESCAN_API}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
    ).then(r => r.json());

    // 🔹 Internal Transactions
    const internal = await fetch(
      `${BASESCAN_API}?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
    ).then(r => r.json());

    // 🔹 ERC20 Token Transfers (proxy for trading)
    const token = await fetch(
      `${BASESCAN_API}?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
    ).then(r => r.json());

    const normalTx = normal.status === "1" ? normal.result : [];
    const internalTx = internal.status === "1" ? internal.result : [];
    const tokenTx = token.status === "1" ? token.result : [];

    // 🎯 Final Score Calculation
    const finalScore =
      normalTx.length * 1 +
      internalTx.length * 1 +
      tokenTx.length * 2;

    // 🐋 Category Logic
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
      transactions: [...normalTx].slice(-10).reverse(),
    });

  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch Base wallet data" });
  }
}
