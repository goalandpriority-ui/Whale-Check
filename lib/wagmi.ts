'use client'

import { createConfig, mainnet, WagmiConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { publicClient, webSocketPublicClient } from '@wagmi/core'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { InjectedConnector } from 'wagmi/connectors/injected'

// Connectors
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains: [base] }),
    new WalletConnectConnector({
      chains: [base],
      options: {
        projectId: 'c56357101a152b7e2d6b4c3b8f12345', // replace your WalletConnect ID
      },
    }),
    new InjectedConnector({ chains: [base] }),
  ],
  publicClient,
  webSocketPublicClient,
})
