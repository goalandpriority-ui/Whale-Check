// pages/api/analyze.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";
import { ethers } from "ethers";

// ✅ IMPORTANT: BASE_MAINNET
const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
  network: Network.BASE_MAINNET,
});

// Wallet Category
function categorizeVolume(volumeUSD: number) {
  if (volumeUSD < 1000) return "Shrimp 🦐";
  if (volumeUSD < 10000) return "Dolphin 🐬";
  if (volumeUSD < 100000) return "Whale 🐋";
  return "Big Whale 🐳";
}

// Fetch transfers
async function fetchWalletTransactions(address: string) {
  let pageKey: string | undefined = undefined;
  let allTransfers: any[] = [];

  do {
    const response = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: address,
      category: [
        AssetTransfersCategory.EXTERNAL,
        AssetTransfersCategory.INTERNAL,
        AssetTransfersCategory.ERC20,
      ],
      maxCount: 100,
      pageKey,
    });

    allTransfers = allTransfers.concat(response.transfers);
    pageKey = response.pageKey;
  } while (pageKey);

  return allTransfers;
}

// Calculate ETH volume
function calculateVolumeUSD(transactions: any[]) {
  const BASE_ETH_PRICE = 3000; // temporary static price
  let totalVolume = 0;

  transactions.forEach((tx) => {
    if (!tx.value) return;

    try {
      const amount = Number(ethers.formatEther(tx.value));
      totalVolume += amount * BASE_ETH_PRICE;
    } catch {
      return;
    }
  });

  return totalVolume;
}

// API handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try {
    const transfers = await fetchWalletTransactions(address);
    const totalVolumeUSD = calculateVolumeUSD(transfers);
    const category = categorizeVolume(totalVolumeUSD);

    return res.status(200).json({
      totalTransactions: transfers.length,
      totalVolumeUSD,
      category,
    });
  } catch (error: any) {
    console.error("Alchemy Error:", error);
    return res.status(500).json({
      error: "Failed to fetch wallet transactions",
      details: error.message,
    });
  }
}
