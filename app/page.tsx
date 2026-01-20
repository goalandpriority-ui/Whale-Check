'use client'

import { useAccount, useBalance } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()

  const { data: balance, isLoading } = useBalance({
    address: isConnected ? address : undefined,
  })

  return (
    <main style={{ padding: 20 }}>
      <h1>Base Whale Check</h1>
      <p>Check whale power on Base</p>

      {!isConnected && <p>Connect your wallet to continue</p>}

      {isConnected && (
        <>
          <p><b>Wallet:</b> {address}</p>

          {isLoading && <p>Loading balance...</p>}

          {balance && (
            <p>
              <b>Balance:</b> {balance.formatted} {balance.symbol}
            </p>
          )}
        </>
      )}
    </main>
  )
}
