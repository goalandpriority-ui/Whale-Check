'use client'

import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function Home() {
  const { address, isConnected } = useAccount()

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })

  const { disconnect } = useDisconnect()

  const { data: balance, isLoading } = useBalance({
    address,
  })

  const ethBalance = balance ? Number(balance.formatted) : 0

  let status = '🦐 Shrimp'

  if (ethBalance >= 1) {
    status = '🐳 Mega Whale'
  } else if (ethBalance >= 0.5) {
    status = '🐋 Whale'
  } else if (ethBalance >= 0.05) {
    status = '🐬 Dolphin'
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>🐋 Base Whale Check</h1>
      <p>Check whale power on Base</p>

      {!isConnected ? (
        <button onClick={() => connect()}>
          🔌 Connect Wallet
        </button>
      ) : (
        <>
          <p><strong>Wallet:</strong> {address}</p>

          {isLoading ? (
            <p>Loading balance...</p>
          ) : (
            <>
              <p><strong>Balance:</strong> {ethBalance} ETH</p>
              <h2>Status: {status}</h2>
            </>
          )}

          <button onClick={() => disconnect()}>
            ❌ Disconnect
          </button>
        </>
      )}
    </main>
  )
}
