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

    // 1️⃣ Normal Transactions
    const normal = await fetch(
      `${BASESCAN_API}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
    ).then(r => r.json());

    // 2️⃣ Internal Transactions
    const internal = await fetch(
      `${BASESCAN_API}?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
    ).then(r => r.json());

    // Combine both
    const normalTx = normal.status === "1" ? normal.result : [];
    const internalTx = internal.status === "1" ? internal.result : [];

    const allTx = [...normalTx, ...internalTx];

    if (allTx.length === 0) {
      return res.status(200).json({
        address,
        totalVolumeETH: 0,
        category: "🦐 Shrimp",
        transactionCount: 0,
        transactions: [],
      });
    }

    // 🔥 Calculate ETH volume
    let totalVolume = 0;

    allTx.forEach((tx: any) => {
      const valueETH = Number(tx.value) / 1e18;
      totalVolume += valueETH;
    });

    // 🐋 Category Logic (Your Range)
    let category = "🦐 Shrimp";

    if (totalVolume >= 5) {
      category = "🐋 Big Whale";
    } else if (totalVolume >= 3) {
      category = "🐳 Whale";
    } else if (totalVolume >= 1) {
      category = "🐬 Dolphin";
    }

    return res.status(200).json({
      address,
      totalVolumeETH: totalVolume.toFixed(4),
      category,
      transactionCount: allTx.length,
      transactions: allTx.slice(-10).reverse(),
    });

  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch Base wallet data" });
  }
}
