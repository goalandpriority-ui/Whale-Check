'use client'

import { createConfig, WagmiConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect'

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains: [base],
      options: {
        projectId: 'c56357101a152bXXXXXX', // Replace with your WalletConnect Project ID
      },
    }),
  ],
  publicClient: publicProvider(),
})
