"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function WalletStatus() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: connectors[0] })}
        style={{
          padding: "10px 16px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "14px", marginBottom: "8px" }}>
        Connected:
        <br />
        <b>
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </b>
      </p>

      <button
        onClick={() => disconnect()}
        style={{
          padding: "8px 14px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          cursor: "pointer",
          fontSize: "13px",
        }}
      >
        Disconnect
      </button>
    </div>
  );
}
