import type { NextApiRequest, NextApiResponse } from "next";

const API_URL = "https://api.etherscan.io/v2/api";
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
      `${API_URL}?chainid=${CHAIN_ID}&module=account&action=${action}&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;

    // Fetch all 3 types
    const [normalRes, internalRes, tokenRes] = await Promise.all([
      fetch(buildUrl("txlist")).then(r => r.json()),
      fetch(buildUrl("txlistinternal")).then(r => r.json()),
      fetch(buildUrl("tokentx")).then(r => r.json())
    ]);

    // Debug (remove later if needed)
    console.log("Normal:", normalRes.status);
    console.log("Internal:", internalRes.status);
    console.log("Token:", tokenRes.status);

    const normalTx = normalRes.status === "1" ? normalRes.result : [];
    const internalTx = internalRes.status === "1" ? internalRes.result : [];
    const tokenTx = tokenRes.status === "1" ? tokenRes.result : [];

    const finalScore =
      normalTx.length * 1 +
      internalTx.length * 1 +
      tokenTx.length * 2;

    let category = "🦐 Shrimp";

    if (finalScore >= 15) category = "🐋 Big Whale";
    else if (finalScore >= 10) category = "🐳 Whale";
    else if (finalScore >= 5) category = "🐬 Dolphin";

    return res.status(200).json({
      address,
      normalTxCount: normalTx.length,
      internalTxCount: internalTx.length,
      tokenTxCount: tokenTx.length,
      finalScore,
      category
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Failed to fetch Base wallet data" });
  }
}
