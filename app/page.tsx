'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function Page() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected)
    return (
      <div>
        Connected as {address}
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          Connect {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading && pendingConnector?.id === connector.id && ' (connecting)'}
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
}
