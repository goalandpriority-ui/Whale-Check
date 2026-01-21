'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
})

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>
}
