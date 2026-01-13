"use client";

import React, { useState } from "react";

export default function WalletStatus() {
  const [isConnected, setIsConnected] = useState(false);

  // Dummy connect function - replace with actual wallet connect logic
  const connectWallet = () => {
    setIsConnected(true);
  };

  // Dummy disconnect function - replace with actual wallet disconnect logic
  const disconnectWallet = () => {
    setIsConnected(false);
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        border: "2px solid #0070f3",
        borderRadius: "12px",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 4px 12px rgba(0, 112, 243, 0.2)",
        backgroundColor: isConnected ? "#e6f0ff" : "#fff",
      }}
    >
      <h2 style={{ fontSize: "1.8rem", marginBottom: "12px", color: "#0070f3" }}>
        🐋 Whale Check
      </h2>

      {!isConnected ? (
        <>
          <p style={{ marginBottom: "20px", fontSize: "1.1rem", color: "#333" }}>
            Please connect your wallet to continue.
          </p>
          <button
            onClick={connectWallet}
            style={{
              padding: "10px 24px",
              fontSize: "1rem",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#005bb5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0070f3")}
          >
            Connect Wallet
          </button>
        </>
      ) : (
        <>
          <p style={{ marginBottom: "20px", fontSize: "1.1rem", color: "#333" }}>
            Wallet connected successfully!
          </p>
          <button
            onClick={disconnectWallet}
            style={{
              padding: "10px 24px",
              fontSize: "1rem",
              backgroundColor: "#e00",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b50000")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e00")}
          >
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}
