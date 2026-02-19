"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useEffect, useState } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/wallet?address=${address}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [address]);

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Whale Check 🐋</h1>

      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
          style={{
            padding: "10px 20px",
            background: "black",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p>
            <strong>Connected:</strong> {address}
          </p>

          <button
            onClick={() => disconnect()}
            style={{
              padding: "6px 12px",
              marginBottom: 20,
              background: "red",
              color: "white",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Disconnect
          </button>

          {loading && <p>Checking wallet activity...</p>}

          {data && (
            <div
              style={{
                marginTop: 20,
                padding: 20,
                border: "1px solid #ddd",
                borderRadius: 12,
                maxWidth: 500,
              }}
            >
              <h2>📊 Wallet Stats</h2>

              <p>
                <strong>Total Transactions:</strong>{" "}
                {data.totalTransactions}
              </p>

              <hr />

              <h3>💎 ETH Activity</h3>
              <p>
                <strong>ETH Volume:</strong> {data.ethVolume} ETH
              </p>
              <p>
                <strong>ETH USD Value:</strong> ${data.ethUsd}
              </p>
              <p>
                <strong>Current ETH Price:</strong> ${data.ethPrice}
              </p>

              <hr />

              <h3>🪙 ERC20 Activity</h3>
              <p>
                <strong>ERC20 Transactions:</strong>{" "}
                {data.erc20Transactions}
              </p>
              <p>
                <strong>ERC20 USD Volume:</strong> $
                {data.erc20UsdVolume}
              </p>

              <hr />

              <h2>
                🐋 Whale Status:{" "}
                <span style={{ color: "#2563eb" }}>
                  {data.status}
                </span>
              </h2>
            </div>
          )}
        </>
      )}
    </main>
  );
}
