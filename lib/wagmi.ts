'use client'

import { configureChains, createClient } from 'wagmi'
import { base } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { walletConnect } from '@wagmi/connectors'

// Configure chains + providers
const { chains, publicClient } = configureChains(
  [base],
  [publicProvider()]
)

// Create wagmi client
export const wagmiClient = createClient({
  autoConnect: true, // v2 la valid
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      chains
    })
  ],
  publicClient
})
