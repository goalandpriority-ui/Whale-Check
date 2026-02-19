// lib/wagmi.ts
'use client'

import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [injected()],
  publicClient: http(base.rpcUrls.default.http[0]),
})
