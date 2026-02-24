'use client'

import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { walletConnect, metaMask } from '@wagmi/connectors'

// MetaMask SDK 0.33.0 compatible config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }),
    metaMask({
      options: {
        // MetaMask 0.33.0 uses default options
        // Optional: you can add pollingInterval, shimDisconnect etc.
      },
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})
