'use client'

import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const { data: balance } = useBalance({
    address,
  })

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        fontFamily: 'sans-serif',
      }}
    >
      <h1>🐋 Base Whale Check</h1>

      {!isConnected ? (
        <button
          onClick={() => connect({ connector: connectors[0] })}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p>
            <b>Address:</b> {address}
          </p>

          <p>
            <b>Balance:</b>{' '}
            {balance
              ? `${balance.formatted} ${balance.symbol}`
              : 'Loading...'}
          </p>

          <button
            onClick={() => disconnect()}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Disconnect
          </button>
        </>
      )}
    </main>
  )
}
