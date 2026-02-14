'use client'

import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const ALCHEMY_RPC = process.env.NEXT_PUBLIC_ALCHEMY_RPC!;

  // 🔥 Base DEX Routers
  const DEX_ROUTERS = [
    "0x2626664c2603336E57B271c5C0b26F421741e481", // Uniswap V3 Router (Base)
  ];

  async function analyzeWallet() {
    try {
      if (!address || !ethers.isAddress(address)) {
        alert("Enter valid Base wallet address");
        return;
      }

      setLoading(true);
      setResult(null);

      const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC);

      // ETH Balance
      const balance = await provider.getBalance(address);
      const ethBalance = parseFloat(ethers.formatEther(balance));

      const fromBlock = "0x1000000";

      // 🔥 Get normal external transactions
      const transfers = await provider.send("alchemy_getAssetTransfers", [
        {
          fromBlock,
          toBlock: "latest",
          fromAddress: address,
          category: ["external"],
        },
      ]);

      let swapCount = 0;
      let tradingVolume = 0;

      transfers.transfers.forEach((tx: any) => {
        if (tx.to && DEX_ROUTERS.includes(tx.to)) {
          swapCount++;

          if (tx.value) {
            tradingVolume += parseFloat(tx.value);
          }
        }
      });

      // Classification logic
      let classification = "🐟 Small Fish";

      if (swapCount > 50) classification = "🐬 Active Trader";
      if (swapCount > 200) classification = "🦈 Shark Trader";
      if (swapCount > 500) classification = "🐋 Whale Trader";

      setResult({
        ethBalance: ethBalance.toFixed(4),
        swapCount,
        tradingVolume: tradingVolume.toFixed(4),
        classification,
      });

    } catch (error: any) {
      console.error("FULL ERROR:", error);
      alert("Error: " + (error?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>🐋 Base Whale Engine (Trading Mode)</h1>

      <input
        placeholder="Enter Base wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ padding: 10, width: 400 }}
      />

      <br /><br />

      <button onClick={analyzeWallet} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Wallet"}
      </button>

      {result && (
        <div style={{ marginTop: 30 }}>
          <p>ETH Balance: {result.ethBalance} ETH</p>
          <p>DEX Swaps: {result.swapCount}</p>
          <p>Trading Volume (ETH): {result.tradingVolume}</p>
          <h2>{result.classification}</h2>
        </div>
      )}
    </main>
  );
}
