"use client"

import { ReactNode } from "react"
import { WagmiConfig, createConfig, http } from "wagmi"
import { base } from "wagmi/chains"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector(),
    new WalletConnectConnector({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
      chains: [base],
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
