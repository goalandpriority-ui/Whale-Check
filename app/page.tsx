"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useBalance, useDisconnect } from "wagmi";
import { classifyWallet, WalletType } from "@/lib/classifyWallet";
import { fetchTransactionsAndVolume } from "@/lib/api";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { data: ethBalance } = useBalance({ address });

  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  const [transactions, setTransactions] = useState(0);
  const [volume, setVolume] = useState(0);
  const [walletType, setWalletType] = useState<WalletType>("No Activity ❌");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setTransactions(0);
      setVolume(0);
      setWalletType("No Activity ❌");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const { transactions, volume } = await fetchTransactionsAndVolume(address);
      setTransactions(transactions);
      setVolume(volume);
      setWalletType(classifyWallet(transactions, volume));
      setLoading(false);
    };

    fetchData();
  }, [address]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🐳 Whale Check
      </h1>

      {!isConnected && (
        <p className="text-gray-400">Connect your wallet to continue</p>
      )}

      {isConnected && (
        <>
          <p className="mb-2">
            Address: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>

          <p className="mb-4">
            ETH Balance:{" "}
            {ethBalance
              ? `${Number(ethBalance.formatted).toFixed(4)} ETH`
              : "No balance"}
          </p>

          {/* Token address input (future use) */}
          <input
            type="text"
            placeholder="Enter token contract address (e.g. USDT)"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full max-w-sm p-2 rounded text-black mb-3"
          />

          <p className="mb-6">
            Token Balance:{" "}
            {tokenBalance ?? "No balance or invalid token address"}
          </p>

          {loading ? (
            <p>Loading wallet activity...</p>
          ) : (
            <>
              <p className="mb-2">📊 Total Transactions: {transactions}</p>
              <p className="mb-2">💰 Total Volume: {volume.toFixed(4)} ETH</p>
              <p className="mb-6 font-semibold text-xl">
                Wallet Type: {walletType}
              </p>
            </>
          )}

          <button
            onClick={() => disconnect()}
            className="bg-red-600 px-6 py-2 rounded font-semibold"
          >
            Disconnect
          </button>
        </>
      )}
    </main>
  );
}
