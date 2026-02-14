'use client'

import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const ALCHEMY_RPC =
    "https://base-mainnet.g.alchemy.com/v2/e9c7wDqC7HFFElN7KuQQP";

  async function analyzeWallet() {
    try {
      if (!address) {
        alert("Enter wallet address");
        return;
      }

      setLoading(true);
      setResult(null);

      const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC);

      // ETH Balance
      const balance = await provider.getBalance(address);
      const ethBalance = parseFloat(ethers.formatEther(balance));

      // ETH Transfers
      const ethTransfers = await provider.send("alchemy_getAssetTransfers", [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          fromAddress: address,
          category: ["external"],
        },
      ]);

      // ERC20 Transfers
      const erc20Transfers = await provider.send(
        "alchemy_getAssetTransfers",
        [
          {
            fromBlock: "0x0",
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

      // Classification
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
    } catch (error) {
      console.error(error);
      alert("Whale analysis failed");
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

      <br />
      <br />

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
