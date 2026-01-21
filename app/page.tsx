'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main style={{ padding: 20 }}>
      <h1>Whale Check</h1>

      {!isConnected && (
        <button onClick={() => connect({ connector: connectors[0] })}>
          Connect Wallet
        </button>
      )}

      {isConnected && (
        <>
          <p>Address: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      )}
    </main>
  );
}
