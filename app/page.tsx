'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div style={{ padding: 20 }}>
        <p>Connected Wallet:</p>
        <b>{address}</b>
        <br /><br />
        <button onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => connect({ connector: connectors[0] })}>
        Connect Wallet
      </button>
    </div>
  );
}
