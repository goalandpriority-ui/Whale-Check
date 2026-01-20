'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { metaMask } from 'wagmi/connectors'
import { ReactNode } from 'react'

const queryClient = new QueryClient()

const config = createConfig({
  chains: [base],
  connectors: [
    metaMask()
  ],
  transports: {
    [base.id]: http()
  }
})

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
