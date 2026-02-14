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

      console.log("RPC:", ALCHEMY_RPC); // debug

      setLoading(true);
      setResult(null);

      const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC);

      // ETH Balance
      const balance = await provider.getBalance(address);
      const ethBalance = parseFloat(ethers.formatEther(balance));

      // Limit block range (IMPORTANT)
      const fromBlock = "0x1000000";

      const ethTransfers = await provider.send("alchemy_getAssetTransfers", [
        {
          fromBlock,
          toBlock: "latest",
          fromAddress: address,
          category: ["external"],
        },
      ]);

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

      const ethTxCount = ethTransfers.transfers.length;
      const erc20TxCount = erc20Transfers.transfers.length;

      let totalTokenVolume = 0;

      erc20Transfers.transfers.forEach((tx: any) => {
        if (tx.value) {
          totalTokenVolume += parseFloat(tx.value);
        }
      });

      let classification = "🐟 Small Fish";
      const totalTx = ethTxCount + erc20TxCount;

      if (totalTx > 500) classification = "🐬 Dolphin";
      if (totalTx > 2000) classification = "🦈 Shark";
      if (totalTx > 5000) classification = "🐋 Whale";

      setResult({
        ethBalance: ethBalance.toFixed(4),
        ethTxCount,
        erc20TxCount,
        totalTokenVolume: totalTokenVolume.toFixed(2),
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
      <h1>🐋 Base Whale Engine</h1>

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
          <p>ETH Transfers: {result.ethTxCount}</p>
          <p>ERC20 Transfers: {result.erc20TxCount}</p>
          <p>Total Token Volume: {result.totalTokenVolume}</p>
          <h2>{result.classification}</h2>
        </div>
      )}
    </main>
  );
}
