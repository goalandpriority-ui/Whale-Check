import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    walletConnect({
      projectId: 'c56357101a152b811310071d8366d90',
    }),
  ],
  transports: {
    [base.id]: http(),
  },
})
