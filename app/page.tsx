'use client'

import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const ALCHEMY_RPC = process.env.NEXT_PUBLIC_ALCHEMY_RPC!;

  async function analyzeWallet() {
    try {
      if (!address || !ethers.isAddress(address)) {
        alert("Enter valid Base wallet address");
        return;
      }

      setLoading(true);
      setResult(null);

      const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC);

      // ✅ ETH Balance
      const balance = await provider.getBalance(address);
      const ethBalance = parseFloat(ethers.formatEther(balance));

      const fromBlock = "0x1000000"; // limit block scan

      // ✅ ERC20 Transfers (Better trading detection)
      const erc20Transfers = await provider.send(
        "alchemy_getAssetTransfers",
        [
          {
            fromBlock,
            toBlock: "latest",
            fromAddress: address,
            category: ["erc20"],
          },
        ]
      );

      let swapCount = 0;
      let tradingVolume = 0;

      erc20Transfers.transfers.forEach((tx: any) => {
        swapCount++;

        if (tx.value && tx.rawContract?.decimals) {
          const decimals = parseInt(tx.rawContract.decimals);
          const adjusted =
            parseFloat(tx.value) / Math.pow(10, decimals);

          tradingVolume += adjusted;
        }
      });

      // ✅ Classification Logic
      let classification = "🐟 Small Fish";

      if (swapCount > 100) classification = "🐬 Active Trader";
      if (swapCount > 500) classification = "🦈 Shark Trader";
      if (swapCount > 1000) classification = "🐋 Whale Trader";

      setResult({
        ethBalance: ethBalance.toFixed(4),
        swapCount,
        tradingVolume: tradingVolume.toFixed(2),
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
      <h1>🐋 Base Whale Engine (ERC20 Trading Mode)</h1>

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
          <p>ERC20 Transfers: {result.swapCount}</p>
          <p>Total Token Volume (adjusted): {result.tradingVolume}</p>
          <h2>{result.classification}</h2>
        </div>
      )}
    </main>
  );
}
