import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    walletConnect({
      projectId: 'c56357101a152b811310071d8366d90', // un project id
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})
