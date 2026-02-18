// lib/wagmi.ts
'use client'

import { createConfig, configureChains, WagmiConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { walletConnect } from '@wagmi/connectors'
import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient } = configureChains(
  [base],
  [publicProvider()]
)

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    walletConnect({
      chains,
      projectId: 'c56357101a152bXXXXXX', // WalletConnect Project ID
    }),
  ],
  publicClient,
})
