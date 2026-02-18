'use client'

import React, { useEffect, useState } from 'react'
import { useAccount, useBalance, useConnect } from 'wagmi'
import { MetaMaskConnector, CoinbaseWalletConnector, InjectedConnector } from '@wagmi/core/connectors'
import { wagmiConfig } from '../lib/wagmi'

export default function WalletAnalyzer() {
  const { connect, connectors } = useConnect()
  const { address, isConnected } = useAccount()
  const { data: balanceData } = useBalance({ address })
  
  const [ethBalance, setEthBalance] = useState('0.0000')

  useEffect(() => {
    if (balanceData?.formatted) {
      setEthBalance(parseFloat(balanceData.formatted).toFixed(4))
    }
  }, [balanceData])

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">🐋 Base Wallet Analyzer</h2>

      {isConnected ? (
        <div>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>ETH Balance:</strong> {ethBalance} ETH</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Connect with {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
