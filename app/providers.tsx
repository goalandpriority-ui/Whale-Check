'use client'

import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '../lib/wagmi'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      {children}
    </WagmiProvider>
  )
}
