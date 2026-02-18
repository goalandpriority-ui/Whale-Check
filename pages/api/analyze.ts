// pages/api/analyze.ts
import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;
const BASE_RPC = process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org";

const provider = new ethers.JsonRpcProvider(`${BASE_RPC}?apikey=${ALCHEMY_KEY}`);

async function fetchNormalTxs(address: string) {
  try {
    const history = await provider.getHistory(address, 0, "latest");
    return history;
  } catch (err) {
    console.error("Normal txs fetch error:", err);
    return [];
  }
}

async function fetchERC20Transfers(address: string) {
  try {
    // Using Alchemy ERC20 Transfers
    const url = `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`;
    // For simplicity, returning empty array; implement actual ERC20 fetch if needed
    return [];
  } catch {
    return [];
  }
}

async function fetchInternalTxs(address: string) {
  // Base mainnet internal txs via provider (optional)
  return [];
}

async function fetchUniswapVolume(address: string) {
  // Optional: fetch Uniswap V3 swaps using Alchemy / TheGraph
  return 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { address } = req.query;
    if (!address || typeof address !== "string") {
      return res.status(400).json({ error: "Address required" });
    }

    const [normalTxs, internalTxs, erc20Txs, uniswapVolumeUSD] = await Promise.all([
      fetchNormalTxs(address),
      fetchInternalTxs(address),
      fetchERC20Transfers(address),
      fetchUniswapVolume(address),
    ]);

    const totalTxCount = normalTxs.length + internalTxs.length + erc20Txs.length;

    // Total USD volume (ETH value only)
    let totalVolumeUSD = 0;
    const ETH_PRICE = 2000; // replace with real-time fetch if needed

    normalTxs.forEach((tx: any) => {
      totalVolumeUSD += parseFloat(ethers.formatEther(tx.value)) * ETH_PRICE;
    });

    totalVolumeUSD += uniswapVolumeUSD;

    // Determine category based on totalTxCount
    let category = "🦐 Shrimp";
    if (totalTxCount >= 5 && totalTxCount < 10) category = "🐬 Dolphin";
    else if (totalTxCount >= 10 && totalTxCount < 15) category = "🐳 Whale";
    else if (totalTxCount >= 15) category = "🐋 Big Whale";

    res.status(200).json({
      address,
      totalTxCount,
      totalVolumeUSD,
      category,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
}
