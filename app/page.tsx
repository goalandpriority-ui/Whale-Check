'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Page() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <main style={{ padding: 20 }}>
      <h1>🐳 Whale Check</h1>

      {!isConnected && (
        <div>
          <p>Wallet not connected</p>

          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              style={{ marginTop: 10 }}
            >
              Connect Wallet
            </button>
          ))}
        </div>
      )}

      {isConnected && (
        <div>
          <p>Connected Wallet:</p>
          <p>{address}</p>

          <button onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      )}
    </main>
  )
}
