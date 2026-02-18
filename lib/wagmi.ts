'use client'

import { createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { publicClient } from 'wagmi'
import { WalletConnectConnector } from '@wagmi/connectors'

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains: [base],
      options: {
        projectId: 'c56357101a152bXXXXXX', // WalletConnect Project ID
      },
    }),
  ],
  publicClient: publicClient({ chain: base }),
})
