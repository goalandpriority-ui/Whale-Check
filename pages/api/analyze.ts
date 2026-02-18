import { NextApiRequest, NextApiResponse } from "next";

const BASESCAN_API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY; // optional if Uniswap volume required

const ETH_PRICE_USD = 2000; // Example: can integrate CoinGecko later for real-time price

async function fetchBaseScan(address: string, action: string) {
  const url = `https://api.basescan.org/api?module=account&action=${action}&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${BASESCAN_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "1") return []; // status 0 = no tx or error
  return data.result || [];
}

async function fetchUniswapVolume(address: string) {
  // Optional: replace with real Uniswap v3 logic if needed
  return 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { address } = req.query;
    if (!address || typeof address !== "string") {
      return res.status(400).json({ error: "Address required" });
    }

    const [normalTxs, internalTxs, erc20Txs, uniswapVolume] = await Promise.all([
      fetchBaseScan(address, "txlist"),
      fetchBaseScan(address, "txlistinternal"),
      fetchBaseScan(address, "tokentx"),
      fetchUniswapVolume(address),
    ]);

    // Count total transactions
    const totalTxCount = normalTxs.length + internalTxs.length + erc20Txs.length;

    // Compute total USD volume
    let totalVolumeUSD = 0;

    normalTxs.forEach((tx: any) => {
      totalVolumeUSD += parseFloat(tx.value) / 1e18 * ETH_PRICE_USD;
    });
    internalTxs.forEach((tx: any) => {
      totalVolumeUSD += parseFloat(tx.value) / 1e18 * ETH_PRICE_USD;
    });
    erc20Txs.forEach((tx: any) => {
      const tokenDecimal = tx.tokenDecimal ? parseInt(tx.tokenDecimal) : 18;
      totalVolumeUSD += parseFloat(tx.value) / Math.pow(10, tokenDecimal) * ETH_PRICE_USD;
    });

    totalVolumeUSD += uniswapVolume;

    // Final score logic
    const finalScore = totalVolumeUSD / 1000 + totalTxCount / 1000;

    let category = "🦐 Shrimp";
    if (finalScore <= 5) category = "🦐 Shrimp";
    else if (finalScore <= 10) category = "🐬 Dolphin";
    else if (finalScore <= 15) category = "🐳 Whale";
    else category = "🐋 Big Whale";

    return res.status(200).json({
      address,
      totalTxCount,
      totalVolumeUSD,
      category,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
