'use client'

import { createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { injectedWallet, metaMaskWallet, walletConnectWallet } from '@wagmi/core/connectors'

// Configure chains
const { chains, publicClient } = configureChains(
  [mainnet], // Base chain use panna
  [
    publicProvider()
  ]
)

// Wagmi config
export const wagmiConfig = createConfig({
  connectors: [
    injectedWallet({ chains }),
    metaMaskWallet({ chains }),
    walletConnectWallet({ chains, projectId: 'c56357101a152b7e2d6b4c3b8f12345' }) // WalletConnect projectId replace pannunga
  ],
  publicClient,
})
