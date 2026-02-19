'use client'

import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from '../lib/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // React Query client create once per app lifecycle
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  )
}
