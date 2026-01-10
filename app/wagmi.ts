'use client'

import { configureChains, createConfig } from 'wagmi'
import { mainnet, base } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { injected, coinbaseWallet } from 'wagmi/connectors'

// 1️⃣ Configure chains
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, base],
  [publicProvider()]
)

// 2️⃣ Create wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    injected({
      chains,
    }),
    coinbaseWallet({
      appName: 'Whale Check',
      chains,
    }),
  ],
  publicClient,
  webSocketPublicClient,
})
