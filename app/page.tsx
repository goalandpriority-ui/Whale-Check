'use client'

import { useState } from "react";
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";
import { ethers } from "ethers";

// Alchemy config
const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

// Wallet category based on USD volume
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
      maxCount: 100, // each request fetch 100 tx
      pageKey,
    });
    allTransactions = allTransactions.concat(response.transfers);
    pageKey = response.pageKey;
  } while (pageKey);

  return allTransactions;
}

// Calculate total USD volume
function calculateVolumeUSD(transactions: any[]) {
  const ETH_PRICE = 1800; // example, use real-time price for production
  let totalVolume = 0;

  transactions.forEach((tx) => {
    if (!tx.value) return;
    const amount = Number(ethers.formatEther(tx.value || "0"));
    totalVolume += amount * ETH_PRICE;
  });

  return totalVolume;
}

// Component
export default function BaseWhaleChecker() {
  const [walletAddress, setWalletAddress] = useState("0x8C4BB608034fE666FeE1eE9a3a3bcB5F28A9a187");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!walletAddress) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const transactions = await fetchWalletTransactions(walletAddress);
      if (transactions.length === 0) {
        setError("No transactions found for this wallet.");
        return;
      }

      const totalVolumeUSD = calculateVolumeUSD(transactions);
      const category = categorizeVolume(totalVolumeUSD);

      setResult({
        totalTransactions: transactions.length,
        totalVolumeUSD,
        category,
      });
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch wallet transactions. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
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
        className="bg-blue-500 text-white p-2 rounded mb-4 w-full"
      >
        {loading ? "Analyzing..." : "Analyze Wallet"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <p>Total Transactions: {result.totalTransactions}</p>
          <p>Total Volume (USD): ${result.totalVolumeUSD.toLocaleString()}</p>
          <p>Wallet Category: {result.category}</p>
        </div>
      )}
    </div>
  );
}
