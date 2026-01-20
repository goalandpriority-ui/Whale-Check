'use client'

import { WagmiConfig, createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { ReactNode } from 'react'

const queryClient = new QueryClient()

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector()
  ],
  publicClient: http(base),
})

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  )
}
