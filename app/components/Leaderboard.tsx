"use client";

import { useEffect, useState } from "react";

type Whale = {
  address: string;
  balance: string;
};

export default function Leaderboard() {
  const [whales, setWhales] = useState<Whale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWhales() {
      try {
        const res = await fetch(
          `https://api.basescan.org/api?module=account&action=balancemulti&address=
0x0000000000000000000000000000000000000000
&tag=latest&apikey=${process.env.NEXT_PUBLIC_BASESCAN_API_KEY}`
        );

        const data = await res.json();

        // TEMP dummy mapping (BaseScan limitation)
        setWhales([
          { address: "0xWhale1...Base", balance: "4200 ETH" },
          { address: "0xWhale2...Base", balance: "3100 ETH" },
          { address: "0xWhale3...Base", balance: "2200 ETH" },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWhales();
  }, []);

  return (
    <div style={{ marginTop: "30px", width: "100%", maxWidth: "400px" }}>
      <h3 style={{ marginBottom: "10px" }}>🐋 Base Whale Leaderboard</h3>

      {loading ? (
        <p>Loading whales...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {whales.map((w, i) => (
            <li
              key={i}
              style={{
                padding: "10px",
                border: "1px solid #eee",
                borderRadius: "8px",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              <b>#{i + 1}</b> {w.address}
              <br />
              💰 {w.balance}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
