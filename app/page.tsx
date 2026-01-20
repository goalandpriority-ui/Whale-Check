'use client'

import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function Page() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address,
  })

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🐳 Base Whale Check</h1>
      <p>Check whale power on Base</p>

      {!isConnected ? (
        <button
          onClick={() => connect()}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <div>
            <strong>Wallet:</strong> {address}
          </div>
          <div>
            <strong>Balance:</strong> {balance?.formatted} {balance?.symbol}
          </div>
          <button
            onClick={() => disconnect()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
              borderRadius: '5px',
            }}
          >
            Disconnect
          </button>
        </>
      )}
    </main>
  )
}
