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

    const response = await fetch(
      `${BASESCAN_API}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
    );

    const data = await response.json();

    if (data.status !== "1") {
      return res.status(200).json({
        address,
        totalVolumeETH: 0,
        category: "🦐 Shrimp",
        transactionCount: 0,
        transactions: [],
      });
    }

    const transactions = data.result;

    // 🔥 Calculate total ETH volume
    let totalVolume = 0;

    transactions.forEach((tx: any) => {
      const valueETH = Number(tx.value) / 1e18;
      totalVolume += valueETH;
    });

    // ✅ CATEGORY LOGIC (YOUR EXACT RANGE)
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
      transactionCount: transactions.length,
      transactions: transactions.slice(-10).reverse(), // last 10
    });

  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch wallet data" });
  }
}
