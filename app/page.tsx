"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main style={{ padding: 20 }}>
      <h1>🐋 Whale Check</h1>

      {!isConnected && (
        <div>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              style={{ marginRight: 10 }}
            >
              Connect {connector.name}
            </button>
          ))}
        </div>
      )}

      {isConnected && (
        <div>
          <p>Connected Address:</p>
          <b>{address}</b>
          <br />
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      )}
    </main>
  );
}
