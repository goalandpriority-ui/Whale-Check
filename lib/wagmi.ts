'use client'

import { createConfig, configureChains, mainnet, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet'
import { InjectedConnector } from '@wagmi/core/connectors/injected'

// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
)

// Create wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({ chains, options: { appName: 'Base Whale Check' } }),
    new InjectedConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
})
