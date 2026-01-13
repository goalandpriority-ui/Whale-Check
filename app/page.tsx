"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

// --------------------
// Whale type helper
// --------------------
function getWhaleType(balance: number) {
  if (balance >= 1000) {
    return { label: "Whale", emoji: "🐳" };
  } else if (balance >= 100) {
    return { label: "Dolphin", emoji: "🐬" };
  } else {
    return { label: "Shrimp", emoji: "🦐" };
  }
}

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const [whales, setWhales] = useState<
    { address: string; balance: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // --------------------
  // Dummy leaderboard (for now)
  // --------------------
  useEffect(() => {
    setLoading(true);

    // Temporary static data
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
    }, 1000);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "16px",
        textAlign: "center",
      }}
    >
      {/* Title */}
      <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>
        🐋 Base Whale Check
      </h1>
      <p>Detect whales on Base chain</p>

      {/* Wallet connect */}
      {!isConnected ? (
        <button
          onClick={() => connect()}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p style={{ fontSize: "14px" }}>
            Connected: {address?.slice(0, 6)}...
            {address?.slice(-4)}
          </p>
          <button
            onClick={() => disconnect()}
            style={{
              marginTop: "8px",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Leaderboard */}
      <h2 style={{ marginTop: "20px", fontWeight: "bold" }}>
        🐋 Base Whale Leaderboard
      </h2>

      {loading && <p>Loading whales...</p>}

      {!loading &&
        whales.map((whale, index) => {
          const type = getWhaleType(whale.balance);

          return (
            <div
              key={index}
              style={{
                width: "90%",
                maxWidth: "420px",
                padding: "12px",
                border: "1px solid #e5e5e5",
                borderRadius: "10px",
              }}
            >
              <div style={{ fontSize: "14px" }}>
                #{index + 1} {whale.address}
              </div>
              <div style={{ marginTop: "4px" }}>
                💰 {whale.balance}+ ETH (Base)
              </div>
              <div style={{ marginTop: "4px", fontWeight: "bold" }}>
                {type.emoji} {type.label}
              </div>
            </div>
          );
        })}

      <p style={{ marginTop: "20px", fontSize: "12px", opacity: 0.6 }}>
        More features coming soon 🚀
      </p>
    </main>
  );
}
