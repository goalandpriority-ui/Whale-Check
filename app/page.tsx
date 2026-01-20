'use client'

import { useAccount, useBalance } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()

  const { data: balance, isLoading } = useBalance({
    address: isConnected ? address : undefined,
  })

  return (
    <main
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>Base Whale Check</h1>
      <p>Check whale power on Base</p>

      {!isConnected && (
        <p style={{ marginTop: '20px' }}>
          🔌 Please connect your wallet
        </p>
      )}

      {isConnected && (
        <div style={{ marginTop: '20px' }}>
          <p>
            <b>Wallet Address:</b><br />
            {address}
          </p>

          {isLoading && <p>Loading balance...</p>}

          {balance && (
            <p>
              <b>Balance:</b> {balance.formatted} {balance.symbol}
            </p>
          )}
        </div>
      )}
    </main>
  )
}
