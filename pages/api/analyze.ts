// pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from "next";

const BASESCAN_API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY;
const ETH_PRICE = 2000;

async function fetchTxs(address: string, type: string) {
  const url = `https://api.basescan.org/api?module=account&action=${type}&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${BASESCAN_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result || [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address as string;
  if (!address) return res.status(400).json({ error: "Address required" });

  try {
    const [normalTxs, internalTxs, erc20Txs] = await Promise.all([
      fetchTxs(address, "txlist"),
      fetchTxs(address, "txlistinternal"),
      fetchTxs(address, "tokentx"),
    ]);

    const totalTxCount = normalTxs.length + internalTxs.length + erc20Txs.length;

    let totalVolumeUSD = 0;
    normalTxs.forEach((tx: any) => totalVolumeUSD += parseFloat(tx.value)/1e18*ETH_PRICE);
    internalTxs.forEach((tx: any) => totalVolumeUSD += parseFloat(tx.value)/1e18*ETH_PRICE);
    erc20Txs.forEach((tx: any) => totalVolumeUSD += parseFloat(tx.value)/1e18*ETH_PRICE);

    let category = "🦐 Shrimp";
    if (totalTxCount >= 5 && totalTxCount < 10) category = "🐬 Dolphin";
    else if (totalTxCount >= 10 && totalTxCount < 15) category = "🐳 Whale";
    else if (totalTxCount >= 15) category = "🐋 Big Whale";

    res.status(200).json({ address, totalTxCount, totalVolumeUSD, category });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
}
