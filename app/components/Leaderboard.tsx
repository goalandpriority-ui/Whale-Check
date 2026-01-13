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
        // BaseScan API url for multiple addresses balance (replace addresses with real whale addresses)
        const addresses = "0x123...,0x456...,0x789..."; // real whale addresses comma separated

        const res = await fetch(
          `https://api.basescan.org/api?module=account&action=balancemulti&address=${addresses}&tag=latest&apikey=${process.env.NEXT_PUBLIC_BASESCAN_API_KEY}`
        );

        const data = await res.json();

        if (data.status === "1") {
          // data.result is array of { account: string, balance: string }
          const whalesData = data.result.map((item: any) => ({
            address: item.account,
            balance: (parseInt(item.balance) / 1e18).toFixed(4) + " ETH",
          }));
          setWhales(whalesData);
        } else {
          console.error("API Error:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
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
