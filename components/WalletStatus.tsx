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
}"use client"

import { ReactNode } from "react"
import { WagmiConfig, configureChains, createConfig } from "wagmi"
import { mainnet } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import { InjectedConnector } from "@wagmi/connectors/injected"

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
})

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  )
}
