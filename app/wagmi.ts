'use client'

import { configureChains, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient } = configureChains(
  [base],
  [publicProvider()]
)

export const config = createConfig({
  autoConnect: true,
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Whale Check',
    }),
  ],
  publicClient,
})
