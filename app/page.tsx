'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Page() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div style={{ padding: 20 }}>
        <p>Connected wallet:</p>
        <b>{address}</b>
        <br /><br />
        <button onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: 20 }}>
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
  )
}
