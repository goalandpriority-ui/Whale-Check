'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => connect({ connector: connectors[0] })}>
        Connect Wallet
      </button>
    </div>
  );
}
