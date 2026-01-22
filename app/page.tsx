'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function Page() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div>
        <p>Connected:</p>
        <b>{address}</b>
        <br />
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
        >
          Connect Wallet
        </button>
      ))}
    </div>
  )
}
