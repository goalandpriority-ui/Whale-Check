'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <main style={{ padding: 40 }}>
      <h1>🐋 Whale Check</h1>

      {isConnected ? (
        <>
          <p>Connected: {address}</p>
          <button onClick={() => disconnect()}>
            Disconnect
          </button>
        </>
      ) : (
        connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            style={{ display: 'block', marginBottom: 10 }}
          >
            Connect {connector.name}
          </button>
        ))
      )}
    </main>
  )
}
