'use client'

import { createConfig, configureChains } from 'wagmi'
import { base } from 'wagmi/chains'
import { publicClient } from 'wagmi'
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@wagmi/connectors'

// Configure chains
const { chains } = configureChains([base], [])

export const wagmiConfig = createConfig({
  connectors: [
    injectedWallet({ chains }),
    metaMaskWallet({ chains }),
    walletConnectWallet({
      chains,
      projectId: 'c56357101a152b7e2d6b4c3b8f12345', // Replace with your WalletConnect Project ID
    }),
  ],
  publicClient,
})
