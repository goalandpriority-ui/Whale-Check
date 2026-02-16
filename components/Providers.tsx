'use client'

import { ReactNode } from 'react'
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from '@wagmi/connectors/injected'
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect'

const { chains, publicClient } = configureChains(
  [mainnet],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY || '' }),
    publicProvider(),
  ]
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '',
      },
    }),
  ],
  publicClient,
})

export function Providers({ children }: { children: ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}
