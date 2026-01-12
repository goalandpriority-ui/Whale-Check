'use client'

import { createConfig } from 'wagmi'
import { http } from 'viem'
import { base } from 'wagmi/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Whale Check'
    })
  ],
  transports: {
    [base.id]: http()
  }
})
