"use client"

import { ReactNode } from "react"
import { createConfig, WagmiConfig, configureChains } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { base } from "wagmi/chains"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const { chains, publicClient } = configureChains(
  [base],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors: [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
        showQrModal: true,
      },
    }),
  ],
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
