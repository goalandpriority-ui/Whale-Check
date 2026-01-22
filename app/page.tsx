"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main style={{ padding: 24 }}>
      <h1>🐋 Whale Check (Base)</h1>

      {!isConnected ? (
        <button onClick={() => connect({ connector: injected() })}>
          Connect Wallet
        </button>
      ) : (
        <>
          <p>Connected wallet:</p>
          <b>{address}</b>
          <br />
          <br />
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      )}
    </main>
  );
}
