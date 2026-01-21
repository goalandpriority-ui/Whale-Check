'use client'

import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()],
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return <WagmiConfig client={client}>{children}</WagmiConfig>
}
