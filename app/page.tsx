'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export default function Page() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <main style={{ padding: '24px' }}>
      <h1>Whale Check</h1>

      {!isConnected ? (
        <>
          <p>Wallet connect pannala</p>
          <button
            onClick={() => connect({ connector: injected() })}
            style={{
              padding: '10px 16px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            Connect Wallet
          </button>
        </>
      ) : (
        <>
          <p>✅ Wallet Connected</p>
          <p>
            Address: <b>{address}</b>
          </p>

          <button
            onClick={() => disconnect()}
            style={{
              padding: '10px 16px',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            Disconnect
          </button>
        </>
      )}
    </main>
  )
}
