"use client"

import { ReactNode } from "react"
import { WagmiConfig, createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import dynamic from "next/dynamic"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// ✅ Dynamic import MetaMask connector, no SSR
const MetaMaskConnector = dynamic(
  () => import("@wagmi/connectors/metaMask").then((mod) => mod.metaMask),
  { ssr: false }
)

// HTTP transport for Base mainnet
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector()
  ],
  publicClient: http(base.rpcUrls.default)
})

const queryClient = new QueryClient()

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  )
}
