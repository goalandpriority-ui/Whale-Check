"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import Leaderboard from "./components/Leaderboard";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>🐋 Whale Check</h1>

      {!isConnected ? (
        <>
          <p style={{ marginBottom: 16 }}>Connect your wallet to begin</p>
          <button
            onClick={() => connect({ connector: injected() })}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            Connect Wallet
          </button>
        </>
      ) : (
        <>
          <p style={{ marginBottom: 10 }}>
            Connected:{" "}
            <strong>
