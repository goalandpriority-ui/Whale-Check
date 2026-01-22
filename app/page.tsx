"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, status } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main style={{ padding: 24 }}>
      <h1>🐋 Whale Check – Base</h1>

      {!isConnected ? (
        <>
          <p>Status: {status}</p>
          <button
            onClick={() => connect({ connector: connectors[0] })}
          >
            Connect Wallet
          </button>
        </>
      ) : (
        <>
          <p>Connected wallet:</p>
          <b>{address}</b>
          <br /><br />
          <button onClick={() => disconnect()}>
            Disconnect
          </button>
        </>
      )}
    </main>
  );
}
