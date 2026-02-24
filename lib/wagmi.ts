'use client'

import { configureChains, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { publicProvider } from '@wagmi/core/providers/public'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [base], 
  [publicProvider()]
)

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
      }
    })
  ],
})
