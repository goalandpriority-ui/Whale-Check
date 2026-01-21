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

  // State for user input token address
  const [tokenAddressInput, setTokenAddressInput] = useState("");

  // Fetch ETH balance
  const { data: ethBalance, isLoading: ethLoading } = useBalance({
    address: address ?? undefined,
    watch: true,
  });

  // Fetch dynamic token balance based on user input
  const { data: customTokenBalance, isLoading: customTokenLoading } = useBalance({
    address,
    token: tokenAddressInput || undefined,
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
                marginBottom: "12px",
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
            ETH Balance:{" "}
            {ethLoading
              ? "Loading..."
              : ethBalance
              ? `${Number(ethBalance.formatted).toFixed(4)} ETH`
              : "No balance"}
          </p>

          <input
            type="text"
            placeholder="Enter token contract address"
            value={tokenAddressInput}
            onChange={(e) => setTokenAddressInput(e.target.value.trim())}
            style={{
              padding: "10px",
              width: "300px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "20px",
              marginBottom: "10px",
              fontSize: "16px",
            }}
          />

          <p>
            Token Balance:{" "}
            {customTokenLoading
              ? "Loading..."
              : customTokenBalance
              ? `${Number(customTokenBalance.formatted).toFixed(4)}`
              : tokenAddressInput
              ? "No balance or invalid token"
              : "-"}
          </p>

          <button
            onClick={() => disconnect()}
            style={{
              padding: "10px 16px",
              background: "#dc2626",
              color: "white",
              borderRadius: "8px",
              marginTop: "30px",
            }}
          >
            Disconnect
          </button>
        </>
      )}
    </main>
  );
}
