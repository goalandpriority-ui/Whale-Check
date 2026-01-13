"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

type Whale = {
  address: string;
  balance: number;
};

export default function Leaderboard() {
  const { isConnected } = useAccount();
  const [whales, setWhales] = useState<Whale[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected) return;

    const fetchWhales = async () => {
      setLoading(true);

      // 🔥 TEMP MOCK DATA (Base whales)
      const data: Whale[] = [
        { address: "0x8A3f...21E9", balance: 1520 },
        { address: "0x91B2...C44A", balance: 980 },
        { address: "0xAA92...88F1", balance: 740 },
        { address: "0xBC21...D901", balance: 420 },
        { address: "0xD912...A11B", balance: 300 },
      ];

      setTimeout(() => {
        setWhales(data);
        setLoading(false);
      }, 1000);
    };

    fetchWhales();
  }, [isConnected]);

  if (!isConnected) return null;

  return (
    <div
      style={{
        marginTop: "40px",
        width: "100%",
        maxWidth: "420px",
        textAlign: "left",
      }}
    >
      <h2 style={{ marginBottom: "12px" }}>🐋 Base Whale Leaderboard</h2>

      {loading && <p>Loading whales...</p>}

      {!loading &&
        whales.map((whale, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #eee",
            }}
          >
            <span>
              #{index + 1} {whale.address}
            </span>
            <strong>{whale.balance} ETH</strong>
          </div>
        ))}
    </div>
  );
}
