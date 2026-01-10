'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected, coinbaseWallet } from 'wagmi/connectors'

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <main style={{ padding: 24 }}>
      <h1>🐋 Whale Check</h1>

      {!isConnected ? (
        <>
          <button
            onClick={() =>
              connect({
                connector: injected(),
              })
            }
          >
            Connect MetaMask
          </button>

          <br /><br />

          <button
            onClick={() =>
              connect({
                connector: coinbaseWallet({
                  appName: 'Whale Check',
                }),
              })
            }
          >
            Connect Coinbase Wallet
          </button>
        </>
      ) : (
        <>
          <p><b>Connected Address:</b></p>
          <p>{address}</p>

          <br />

          <button onClick={() => disconnect()}>
            Disconnect
          </button>
        </>
      )}
    </main>
  )
}
