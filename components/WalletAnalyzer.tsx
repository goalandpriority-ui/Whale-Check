'use client'

import React from 'react'
import { useAccount, useBalance, useConnect } from 'wagmi'
import { WalletConnectConnector } from '@wagmi/connectors'
import { wagmiConfig } from '../lib/wagmi'

export default function WalletAnalyzer() {
  const { connect } = useConnect({
    connector: new WalletConnectConnector({
      chains: [wagmiConfig.connectors[0].chains[0]],
      options: { projectId: 'c56357101a152bXXXX' }, // replace with your ID
    }),
  })

  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })

  let level = 'Shrimp'
  if (balance && parseFloat(balance.formatted) > 10) level = 'Dolphin'
  if (balance && parseFloat(balance.formatted) > 50) level = 'Whale'
  if (balance && parseFloat(balance.formatted) > 200) level = 'Big Whale'

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">🐋 Base Wallet Analyzer</h2>

      {!isConnected ? (
        <button
          onClick={() => connect()}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p><strong>Wallet:</strong> {address}</p>
          <p><strong>ETH Balance:</strong> {balance?.formatted} ETH</p>
          <p><strong>Level:</strong> {level}</p>
        </div>
      )}
    </div>
  )
}
