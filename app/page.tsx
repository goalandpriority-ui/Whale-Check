"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { classifyWallet, WalletType } from "../lib/classifyWallet";

export default function Page() {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [tokenDecimals, setTokenDecimals] = useState<number | null>(null);
  const [transactions, setTransactions] = useState(0);
  const [volume, setVolume] = useState(0);
  const [walletType, setWalletType] = useState<WalletType>("No Activity ❌");

  useEffect(() => {
    // Fake function to simulate fetching transaction count and volume
    async function fetchTransactionsAndVolume() {
      if (!address) return;

      // Replace this with actual API call to fetch transactions and volume
      // For now, dummy values:
      const txCount = 120; // Example tx count
      const txVolume = 1.2; // Example volume in ETH

      setTransactions(txCount);
      setVolume(txVolume);

      const type = classifyWallet(txCount, txVolume);
      setWalletType(type);
    }

    fetchTransactionsAndVolume();
  }, [address]);

  return (
    <div style={{ padding: 20 }}>
      <h1>🐳 Whale Check</h1>

      {address ? (
        <>
          <p>Address: {address}</p>
          <p>ETH Balance: {balanceData?.formatted ?? "No balance"}</p>

          <input
            type="text"
            placeholder="Enter token contract address"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            style={{ marginBottom: 10, width: "100%" }}
          />

          <p>Token Balance: {tokenBalance ?? "No balance or invalid token address"}</p>
          <p>📊 Total Transactions: {transactions}</p>
          <p>💰 Total Volume: {volume} ETH</p>

          <h2>Wallet Type: {walletType}</h2>

          <button
            onClick={() => {
              // Disconnect logic if needed
            }}
          >
            Disconnect
          </button>
        </>
      ) : (
        <p>Wallet connect pannunga macha</p>
      )}
    </div>
  );
}
