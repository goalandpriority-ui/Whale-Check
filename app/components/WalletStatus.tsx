"use client"

import { useAccount, useConnect, useDisconnect } from "wagmi"

export default function WalletStatus() {
  const { address, isConnected } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <button onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={async () => {
            try {
              await connectAsync({ connector })
            } catch (error) {
              console.error(error)
            }
          }}
        >
          Connect {connector.name}
        </button>
      ))}
    </div>
  )
}
