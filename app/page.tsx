'use client'

import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    txCount:"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const ALCHEMY_RPC =
    "https://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY";

  async function analyzeWallet() {
    try {
      setLoading(true);
      setResult(null);

      const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC);

      // ETH Balance
      const balance = await provider.getBalance(address);
      const ethBalance = parseFloat(ethers.formatEther(balance));

      // Normal ETH Transfers
      const ethTransfers = await provider.send("alchemy_getAssetTransfers", [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          fromAddress: address,
          category: ["external"],
          withMetadata: false,
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
            withMetadata: false,
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

      // Simple Classification Logic
      let classification = "🐟 Small Fish";
      if (ethTxCount + erc20TxCount > 500) classification = "🐬 Dolphin";
      if (ethTxCount + erc20TxCount > 2000) classification = "🦈 Shark";
      if (ethTxCount + erc20TxCount > 5000) classification = "🐋 Whale";

      setResult({
        ethBalance,
        ethTxCount,
        erc20TxCount,
        totalTokenVolume: totalTokenVolume.toFixed(2),
        classification,
      });
    } catch (err) {
      console.error(err);
      alert("Error analyzing wallet");
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
          <h3>Results:</h3>
          <p>ETH Balance: {result.ethBalance}</p>
          <p>ETH Transfers: {result.ethTxCount}</p>
          <p>ERC20 Transfers: {result.erc20TxCount}</p>
          <p>Total Token Volume: {result.totalTokenVolume}</p>
          <h2>{result.classification}</h2>
        </div>
      )}
    </main>
  );
    }
