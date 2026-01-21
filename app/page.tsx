'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  return (
    <main style={{ padding: 20 }}>
      <h1>🐋 Whale Check</h1>

      {!isConnected && (
        <button onClick={() => connect()}>
          Connect Wallet
        </button>
      )}

      {isConnected && (
        <>
          <p>Connected: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      )}
    </main>
  );
}
