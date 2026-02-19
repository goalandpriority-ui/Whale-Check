// lib/wagmi.ts
import { createConfig, http } from 'wagmi'
import { mainnet, goerli } from 'wagmi/chains'
import { injected, metaMask, coinbaseWallet } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [mainnet, goerli],
  transports: {
    [mainnet.id]: http(),
    [goerli.id]: http(),
  },
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: 'Base Whale Check' }),
  ],
})
