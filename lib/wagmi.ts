import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    walletConnect({
      projectId: 'YOUR_PROJECT_ID',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})
