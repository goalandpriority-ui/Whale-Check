"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

// --------------------
// Whale type helper
// --------------------
function getWhaleType(balance: number) {
  if (balance >= 1000) return { label: "Whale", emoji: "🐳" };
  if (balance >= 100) return { label: "Dolphin", emoji: "🐬" };
  return { label: "Shrimp", emoji: "🦐" };
}

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [whales, setWhales] = useState<
    { address: string; balance: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Dummy leaderboard
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setWhales([
        {
          address: "0x4833624428Bd1beC281594cEa3050c8EB01311C",
          balance: 1000,
        },
        {
          address: "0x1111222233334444555566667777888899990000",
          balance: 420,
        },
        {
          address: "0xAAAA2222BBBB3333CCCC4444DDDD5555EEEE6666",
          balance: 45,
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        textAlign: "center",
      }}
    >
      <h1>🐋 Base Whale Check</h1>
      <p>Detect whales on Base chain</p>

      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
          style={{ padding: "10px 16px", borderRadius: "8px" }}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p>
            Connected: {address?.slice(0, 6)}...
            {address?.slice(-4)}
          </p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      )}

      <h2 style={{ marginTop: "20px" }}>🐋 Base Whale Leaderboard</h2>

      {loading && <p>Loading whales...</p>}

      {!loading &&
        whales.map((w, i) => {
          const type = getWhaleType(w.balance);
          return (
            <div
              key={i}
              style={{
                width: "90%",
                maxWidth: "420px",
                border: "1px solid #eee",
                padding: "12px",
                borderRadius: "10px",
              }}
            >
              <div>#{i + 1}</div>
              <div>{w.address}</div>
              <div>💰 {w.balance}+ ETH (Base)</div>
              <div>
                {type.emoji} {type.label}
              </div>
            </div>
          );
        })}

      <p style={{ fontSize: "12px", opacity: 0.6 }}>
        More features coming soon 🚀
      </p>
    </main>
  );
}
