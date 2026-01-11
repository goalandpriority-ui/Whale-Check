'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected, coinbaseWallet } from 'wagmi/connectors'

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div>
      {isConnected ? (
        <>
          <p>Connected: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      ) : (
        <>
          <button onClick={() => connect({ connector: injected() })}>
            Connect MetaMask
          </button>

          <button
            onClick={() =>
              connect({
                connector: coinbaseWallet({
                  appName: 'Whale Check',
                }),
              })
            }
          >
            Connect Coinbase
          </button>
        </>
      )}
    </div>
  )
}
