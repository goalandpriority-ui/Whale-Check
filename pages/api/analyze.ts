// app/api/analyze/route.ts
import { NextResponse } from "next/server";
import fetch from "node-fetch";

const BASE_RPC = process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org";
const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY; // Your Alchemy Key
const BASESCAN_API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY; // Optional, if want BaseScan fallback

async function fetchNormalTxs(address: string) {
  const url = `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${BASESCAN_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result || [];
}

async function fetchInternalTxs(address: string) {
  const url = `https://api.basescan.org/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${BASESCAN_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result || [];
}

async function fetchERC20Transfers(address: string) {
  const url = `https://api.basescan.org/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${BASESCAN_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result || [];
}

async function fetchUniswapVolume(address: string) {
  // Example using Alchemy's NFT / Dex endpoint (simplified)
  // Replace with actual Uniswap v3 volume logic if needed
  // Here we just return 0 for demo
  return 0;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    if (!address) return NextResponse.json({ error: "Address required" }, { status: 400 });

    // Fetch all transactions
    const [normalTxs, internalTxs, erc20Txs, uniswapVolumeUSD] = await Promise.all([
      fetchNormalTxs(address),
      fetchInternalTxs(address),
      fetchERC20Transfers(address),
      fetchUniswapVolume(address),
    ]);

    // Count total transactions
    const totalTxCount = normalTxs.length + internalTxs.length + erc20Txs.length;

    // Compute total volume in USD
    let totalVolumeUSD = 0;
    // Convert ETH to USD (simplified: using fixed price or fetch from CoinGecko)
    // Example: assume 1 ETH = 2000 USD for demo
    const ETH_PRICE = 2000;
    normalTxs.forEach((tx: any) => { totalVolumeUSD += parseFloat(tx.value) / 1e18 * ETH_PRICE });
    internalTxs.forEach((tx: any) => { totalVolumeUSD += parseFloat(tx.value) / 1e18 * ETH_PRICE });
    erc20Txs.forEach((tx: any) => { totalVolumeUSD += parseFloat(tx.value) / 1e18 * ETH_PRICE });
    totalVolumeUSD += uniswapVolumeUSD;

    // Calculate category based on totalTxCount
    let category = "🦐 Shrimp";
    if (totalTxCount >= 5 && totalTxCount < 10) category = "🐬 Dolphin";
    else if (totalTxCount >= 10 && totalTxCount < 15) category = "🐳 Whale";
    else if (totalTxCount >= 15) category = "🐋 Big Whale";

    return NextResponse.json({
      address,
      totalTxCount,
      totalVolumeUSD,
      category,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
