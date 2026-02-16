"use client"

import { ReactNode } from "react"
import { WagmiConfig, createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import { InjectedConnector } from "@wagmi/core/connectors/injected"
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector(),
    new WalletConnectConnector({
      chains: [base],
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    }),
  ],
  publicClient: http(base.rpcUrls.default),
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
