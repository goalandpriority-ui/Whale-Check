'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <main style={{ padding: 40 }}>
      <h1>🐳 Whale Check</h1>

      {!isConnected && (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          style={{ marginTop: 20, padding: 10 }}
        >
          Connect Wallet
        </button>
      )}

      {isConnected && (
        <>
          <p style={{ marginTop: 20 }}>
            Connected: <b>{address}</b>
          </p>

          <button
            onClick={() => disconnect()}
            style={{ marginTop: 10, padding: 10 }}
          >
            Disconnect
          </button>
        </>
      )}
    </main>
  )
}
