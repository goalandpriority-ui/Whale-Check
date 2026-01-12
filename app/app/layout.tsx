'use client'

import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { mainnet } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains })
  ],
  publicClient,
  webSocketPublicClient,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={config}>
          {children}
        </WagmiConfig>
      </body>
    </html>
  )
}
