'use client'

import { useState } from "react";
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";
import { ethers } from "ethers";

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
  network: Network.BASE_MAINNET, // Base mainnet
};

const alchemy = new Alchemy(config);

function categorizeVolume(volumeUSD: number) {
  if (volumeUSD < 1000) return "Shrimp 🦐";
  if (volumeUSD < 10000) return "Dolphin 🐬";
  if (volumeUSD < 100000) return "Whale 🐋";
  return "Big Whale 🐳";
}

async function fetchWalletTransactions(address: string) {
  let pageKey: string | undefined = undefined;
  let allTransactions: any[] = [];

  try {
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
        maxCount: 1000,
        pageKey,
      });
      allTransactions = allTransactions.concat(response.transfers);
      pageKey = response.pageKey;
    } while (pageKey);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    throw new Error("Failed to fetch wallet transactions");
  }

  return allTransactions;
}

function calculateVolumeUSD(transactions: any[]) {
  const ETH_PRICE = 1800; // temporary fixed ETH price
  let totalVolume = 0;

  transactions.forEach((tx) => {
    if (!tx.value) return;
    const amount = Number(ethers.formatEther(tx.value || "0"));
    totalVolume += amount * ETH_PRICE;
  });

  return totalVolume;
}

export default function BaseWhaleChecker() {
  const [walletAddress, setWalletAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!walletAddress) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const transactions = await fetchWalletTransactions(walletAddress);
      const totalVolumeUSD = calculateVolumeUSD(transactions);
      const category = categorizeVolume(totalVolumeUSD);

      setResult({
        totalTransactions: transactions.length,
        totalVolumeUSD,
        category,
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch wallet transactions");
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

      {error && (
        <div className="text-red-500 mb-2">{error}</div>
      )}

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <p>Total Transactions: {result.totalTransactions}</p>
          <p>Total Volume (USD): ${result.totalVolumeUSD.toLocaleString()}</p>
          <p>Category: {result.category}</p>
        </div>
      )}
    </div>
  );
}
