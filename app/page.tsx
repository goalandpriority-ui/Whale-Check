"use client";

import WalletStatus from "./components/WalletStatus";
import Leaderboard from "./components/Leaderboard";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        textAlign: "center",
      }}
    >
      {/* Title */}
      <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
        🐋 Whale Check
      </h1>

      {/* Subtitle */}
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Connect your wallet to begin
      </p>

      {/* Wallet Connect / Status */}
      <WalletStatus />

      {/* Leaderboard (Base only) */}
      <Leaderboard />

      {/* Footer text */}
      <p style={{ marginTop: "40px", fontSize: "12px", color: "#999" }}>
        More features coming soon 🚀
      </p>
    </main>
  );
}
