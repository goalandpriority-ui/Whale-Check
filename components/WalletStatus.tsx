"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function WalletStatus() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div style={{ padding: 24 }}>
      <h1>🐋 Whale Check</h1>

      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
          style={{
            padding: "10px 16px",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p>✅ Connected</p>
          <p>
            <b>Address:</b> {address}
          </p>

          <button
            onClick={() => disconnect()}
            style={{
              padding: "10px 16px",
              fontSize: 16,
              marginTop: 10,
              cursor: "pointer",
            }}
          >
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}
