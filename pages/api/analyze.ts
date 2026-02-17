// pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";
import { ethers } from "ethers";

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
  network: Network.ETH_MAINNET,
});

// Wallet category function
function categorizeVolume(volumeUSD: number) {
  if (volumeUSD < 1000) return "Shrimp 🦐";
  if (volumeUSD < 10000) return "Dolphin 🐬";
  if (volumeUSD < 100000) return "Whale 🐋";
  return "Big Whale 🐳";
}

// Fetch wallet transactions
async function fetchWalletTransactions(address: string) {
  let pageKey: string | undefined = undefined;
  let allTransactions: any[] = [];

  do {
    const response = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: address,
      category: [
        AssetTransfersCategory.EXTERNAL,
        AssetTransfersCategory.INTERNAL,
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
      ],
      maxCount: 100,
      pageKey,
    });

    allTransactions = allTransactions.concat(response.transfers);
    pageKey = response.pageKey;
  } while (pageKey);

  return allTransactions;
}

// Calculate total USD volume
function calculateVolumeUSD(transactions: any[]) {
  const ETH_PRICE = 1800; // example price, real-time price can be fetched separately
  let totalVolume = 0;

  transactions.forEach((tx) => {
    if (!tx.value) return;
    const amount = Number(ethers.formatEther(tx.value || "0"));
    totalVolume += amount * ETH_PRICE;
  });

  return totalVolume;
}

// API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try {
    const transactions = await fetchWalletTransactions(address);
    const totalVolumeUSD = calculateVolumeUSD(transactions);
    const category = categorizeVolume(totalVolumeUSD);

    res.status(200).json({
      totalTransactions: transactions.length,
      totalVolumeUSD,
      category,
    });
  } catch (err: any) {
    console.error("Error fetching wallet transactions:", err.message || err);
    res.status(500).json({ error: "Failed to fetch wallet transactions" });
  }
}
