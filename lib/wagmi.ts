'use client'

import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { walletConnect } from '@wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }),
  ],
})
