// lib/wagmi.ts
import { createConfig, configureChains } from 'wagmi'
import { mainnet, goerli } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from '@wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from '@wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from '@wagmi/connectors/injected'

// Chains
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
)

// Connectors
const connectors = [
  new MetaMaskConnector({ chains }),
  new CoinbaseWalletConnector({
    chains,
    options: { appName: 'Base Whale Check' }
  }),
  new InjectedConnector({ chains })
]

// Wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
})
