'use client'

import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { base } from 'wagmi/chains'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const { data: balance, isLoading } = useBalance({
    address,
    chainId: base.id,
  })

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🐋 Whale Check</h1>

      {!isConnected ? (
        <>
          <p>Wallet connect pannala</p>
          <button onClick={() => connect({ connector: injected() })}>
            Connect Wallet
          </button>
        </>
      ) : (
        <>
          <p>✅ Wallet Connected</p>
          <p>
            <b>Address:</b><br />
            {address}
          </p>

          <p>
            <b>Balance (Base ETH):</b><br />
            {isLoading ? 'Loading...' : `${balance?.formatted} ETH`}
          </p>

          <button onClick={() => disconnect()}>
            Disconnect
          </button>
        </>
      )}
    </main>
  )
}
