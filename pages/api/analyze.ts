import type { NextApiRequest, NextApiResponse } from "next";

const BASESCAN_API = "https://api.basescan.org/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Wallet address required" });
  }

  try {
    const apiKey = process.env.BASESCAN_API_KEY;

    // Fetch normal transactions
    const txRes = await fetch(
      `${BASESCAN_API}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${apiKey}`
    );

    const txData = await txRes.json();

    if (txData.status !== "1") {
      return res.status(200).json({
        address,
        totalVolumeETH: 0,
        category: "No Activity",
        transactions: []
      });
    }

    let totalVolumeETH = 0;

    txData.result.forEach((tx: any) => {
      const valueETH = Number(tx.value) / 1e18; // wei → ETH
      totalVolumeETH += valueETH;
    });

    // Whale Classification
    let category = "Shrimp 🦐";

    if (totalVolumeETH > 10000) {
      category = "Blue Whale 🐋";
    } else if (totalVolumeETH > 1000) {
      category = "Whale 🐳";
    } else if (totalVolumeETH > 100) {
      category = "Shark 🦈";
    } else if (totalVolumeETH > 10) {
      category = "Dolphin 🐬";
    }

    return res.status(200).json({
      address,
      totalVolumeETH: totalVolumeETH.toFixed(4),
      category,
      transactionCount: txData.result.length,
      transactions: txData.result.slice(0, 10) // latest 10
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
