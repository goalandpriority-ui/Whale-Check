"use client";

import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useBalance } from "wagmi";
import { getWalletStats } from "@/lib/basescan";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // ETH Balance
  const { data: ethBalance } = useBalance({
    address,
  });

  // Token input
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);

  // Whale stats
  const [txCount, setTxCount] = useState<number | null>(null);
  const [totalVolume, setTotalVolume] = useState<string | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch BaseScan stats
  useEffect(() => {
    if (!address) return;

    const fetchStats = async () => {
      setLoadingStats(true);
      const stats = await getWalletStats(address);
      setTxCount(stats.txCount);
      setTotalVolume(stats.totalVolumeEth);
      setLoadingStats(false);
    };

    fetchStats();
  }, [address]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🐳 Whale Check
      </h1>

      {!isConnected && (
        <p className="text-gray-400">
          Wallet connect pannunga macha
        </p>
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

          {/* Token input */}
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

          {/* Whale stats */}
          {loadingStats ? (
            <p>Loading wallet activity...</p>
          ) : (
            <>
              <p className="mb-2">
                📊 Total Transactions: {txCount}
              </p>
              <p className="mb-6">
                💰 Total Volume: {totalVolume} ETH
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
