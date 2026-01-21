"use client";

import React, { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
} from "wagmi";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading } = useConnect();
  const { disconnect } = useDisconnect();

  const [tokenAddressInput, setTokenAddressInput] = useState("");

  const { data: ethBalance } = useBalance({ address });

  const { data: customTokenBalance, isLoading: customTokenLoading } = useBalance({
    address,
    token: (tokenAddressInput && tokenAddressInput.startsWith("0x") ? tokenAddressInput : undefined) as `0x${string}` | undefined,
    watch: true,
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "16px",
        padding: "20px",
      }}
    >
      <h1>🐳 Whale Check</h1>

      {!isConnected && (
        <>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              disabled={isLoading}
              style={{
                padding: "10px 16px",
                background: "#2563eb",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Connect {connector.name}
            </button>
          ))}
        </>
      )}

      {isConnected && (
        <>
          <p>
            Address: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>

          <p>
            ETH Balance: {ethBalance ? `${Number(ethBalance.formatted).toFixed(4)} ETH` : "No balance"}
          </p>

          <input
            type="text"
            placeholder="Enter token contract address (e.g. USDT)"
            value={tokenAddressInput}
            onChange={(e) => setTokenAddressInput(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              width: "280px",
              marginBottom: "8px",
            }}
          />

          <p>
            Token Balance:{" "}
            {customTokenLoading
              ? "Loading..."
              : customTokenBalance
              ? `${Number(customTokenBalance.formatted).toFixed(4)}`
              : "No balance or invalid token address"}
          </p>

          <button
            onClick={() => disconnect()}
            style={{
              padding: "10px 16px",
              background: "#dc2626",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Disconnect
          </button>
        </>
      )}
    </main>
  );
}
