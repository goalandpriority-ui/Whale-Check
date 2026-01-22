'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main style={{ padding: 20 }}>
      <h1>🐳 Whale Check – Base</h1>

      {!isConnected && (
        <button onClick={() => connect({ connector: connectors[0] })}>
          Connect Wallet
        </button>
      )}

      {isConnected && (
        <>
          <p>Connected Address:</p>
          <code>{address}</code>
          <br /><br />
          <button onClick={() => disconnect()}>
            Disconnect
          </button>
        </>
      )}
    </main>
  );
}
