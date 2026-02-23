import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const rpcUrl =
  process.env.NEXT_PUBLIC_BASE_RPC ||
  'https://mainnet.base.org'  // ✅ Safe public fallback

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http(rpcUrl),
  },
})
