'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Wallet Connected ✅</h2>
        <p><b>Address:</b> {address}</p>

        <button onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Connect your Wallet</h2>

      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={!connector.ready || isPending}
          style={{ display: 'block', marginBottom: 10 }}
        >
          {connector.name}
          {!connector.ready && ' (not supported)'}
        </button>
      ))}

      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </div>
  );
}
