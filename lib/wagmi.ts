import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC

if (!rpcUrl) {
  throw new Error("NEXT_PUBLIC_BASE_RPC is missing")
}

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http(rpcUrl),
  },
})
