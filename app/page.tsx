'use client'

import { useState } from "react";
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";
import { ethers } from "ethers";

const config = {
  apiKey: process.env.ALCHEMY_KEY!,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

// Volume categories
function categorizeVolume(volumeUSD: number) {
  if (volumeUSD < 1000) return "Shrimp 🦐";
  if (volumeUSD < 10000) return "Dolphin 🐬";
  if (volumeUSD < 100000) return "Whale 🐋";
  return "Big Whale 🐳";
}

// Fetch wallet transactions from last 1.5 years + Uniswap V3 swaps
async function fetchWalletTransactions(address: string) {
  const currentBlock = await alchemy.core.getBlockNumber();
  const blocksPerYear = 2102400; // ~1 year ETH blocks
  const fromBlock = `0x${(currentBlock - Math.floor(1.5 * blocksPerYear)).toString(16)}`;

  let pageKey: string | undefined = undefined;
  let allTransactions: any[] = [];

  do {
    const response = await alchemy.core.getAssetTransfers({
      fromBlock,
      fromAddress: address,
      category: [
        AssetTransfersCategory.EXTERNAL,
        AssetTransfersCategory.INTERNAL,
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
      ],
      maxCount: 1000,
      pageKey,
    });
    allTransactions = allTransactions.concat(response.transfers);
    pageKey = response.pageKey;
  } while (pageKey);

  return allTransactions;
}

// Calculate total USD volume
function calculateVolumeUSD(transactions: any[]) {
  const ETH_PRICE = 1800; // replace with live price if needed
  let totalVolume = 0;

  transactions.forEach((tx) => {
    if (!tx.value) return;
    const amount = Number(ethers.formatEther(tx.value || "0"));
    totalVolume += amount * ETH_PRICE;
  });

  return totalVolume;
}

// Main Component
export default function BaseWhaleChecker() {
  const [walletAddress, setWalletAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const transactions = await fetchWalletTransactions(walletAddress);
      const volumeUSD = calculateVolumeUSD(transactions);
      const category = categorizeVolume(volumeUSD);

      setResult({
        detectedSwaps: transactions.length,
        estimatedVolumeUSD: volumeUSD,
        category,
      });
    } catch (err) {
      console.error(err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🐋 Base Whale Checker</h1>

      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="0x..."
        className="border p-2 w-full mb-2"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        {loading ? "Analyzing..." : "Analyze Swaps"}
      </button>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <p>Detected Swaps: {result.detectedSwaps}</p>
          <p>Estimated Volume (USD): ${result.estimatedVolumeUSD.toLocaleString()}</p>
          <p>Category: {result.category}</p>
        </div>
      )}
    </div>
  );
}
