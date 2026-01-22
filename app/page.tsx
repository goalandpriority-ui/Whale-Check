'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div style={{ padding: 20 }}>
      {!isConnected && (
        <>
          {connectors.length === 0 ? (
            <p>
              ❌ No wallet detected.<br />
              👉 Open this site inside MetaMask browser
            </p>
          ) : (
            <button onClick={() => connect({ connector: connectors[0] })}>
              Connect Wallet
            </button>
          )}
        </>
      )}

      {isConnected && (
        <>
          <p>✅ Connected: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      )}

      {status === 'pending' && <p>Connecting...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}
