'use client'

import React from 'react'
import { useAccount, useBalance, useConnect } from 'wagmi'

export default function WalletAnalyzer() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()

  const { data: balance } = useBalance({
    address: address,
  })

  const getWhaleType = (eth: number) => {
    if (eth >= 1000) return '🐋 Big Whale'
    if (eth >= 100) return '🐳 Whale'
    if (eth >= 10) return '🐬 Dolphin'
    return '🦐 Shrimp'
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Whale Wallet Analyzer</h1>

      {!isConnected && (
        <div>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              style={{ marginRight: 10 }}
            >
              Connect {connector.name}
            </button>
          ))}
        </div>
      )}

      {isConnected && (
        <div>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Balance:</strong> {balance?.formatted ?? 0} ETH</p>
          <p>
            <strong>Status:</strong>{' '}
            {balance
              ? getWhaleType(Number(balance.formatted))
              : 'Loading...'}
          </p>
        </div>
      )}
    </div>
  )
}
