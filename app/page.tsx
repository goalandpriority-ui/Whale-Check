"use client";

import { useEffect, useState } from "react";
import WalletStatus from "./components/WalletStatus";
import Leaderboard from "./components/Leaderboard";

export default function Home() {
  const [apiData, setApiData] = useState<any>(null);

  // STEP 9 – API test (backend ready nu confirm panna)
  useEffect(() => {
    fetch("/api/whales")
      .then((res) => res.json())
      .then((data) => {
        console.log("Whale API data:", data);
        setApiData(data);
      })
      .catch((err) => {
        console.error("API error:", err);
      });
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
        background: "#f9f9f9",
      }}
    >
      {/* Title */}
      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
        🐋 Base Whale Check
      </h1>

      <p style={{ marginBottom: "20px", color: "#555" }}>
        Detect whales on Base chain
      </p>

      {/* Wallet connect */}
      <WalletStatus />

      {/* Leaderboard */}
      <Leaderboard />

      {/* API Debug (hidden UI, console-ku mattum) */}
      {apiData && (
        <pre style={{ display: "none" }}>
          {JSON.stringify(apiData, null, 2)}
        </pre>
      )}
    </main>
  );
}
