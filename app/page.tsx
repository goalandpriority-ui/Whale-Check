
"use client";

import { useAccount, useBalance } from "wagmi";

export default function Page() {
  const { address, isConnected } = useAccount();

  const { data: balanceData, isLoading } = useBalance({
    address,
    chainId: 8453, // Base mainnet
    enabled: isConnected,
  });

  const ethBalance = balanceData
    ? Number(balanceData.formatted)
    : 0;

  function getWhaleType(balance: number) {
    if (balance >= 1000) return "🐋 Whale";
    if (balance >= 100) return "🐬 Dolphin";
    return "🦐 Shrimp";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "serif",
        maxWidth: "420px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
        🐳 Base Whale Check
      </h1>

      <p style={{ marginBottom: "20px" }}>
        Detect whales on Base chain
      </p>

      {/* Wallet connect button already exists in layout */}
      {!isConnected && (
        <p style={{ marginTop: "20px" }}>
          👉 Connect wallet to check status
        </p>
      )}

      {isConnected && (
        <div
          style={{
            marginTop: "30px",
            padding: "16px",
            border: "1px solid #eee",
            borderRadius: "12px",
          }}
        >
          <h3>Connected Wallet</h3>

          <p
            style={{
              wordBreak: "break-all",
              fontSize: "14px",
              marginBottom: "10px",
            }}
          >
            {address}
          </p>

          {isLoading ? (
            <p>Loading balance...</p>
          ) : (
            <>
              <p style={{ fontSize: "18px" }}>
                💰 {ethBalance.toFixed(4)} ETH (Base)
              </p>

              <p style={{ fontSize: "20px", marginTop: "8px" }}>
                {getWhaleType(ethBalance)}
              </p>
            </>
          )}
        </div>
      )}

      <p
        style={{
          marginTop: "40px",
          textAlign: "center",
          opacity: 0.6,
        }}
      >
        More features coming soon 🚀
      </p>
    </main>
  );
}
