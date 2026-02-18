'use client'

import React, { useState } from 'react'
import { useAccount, useBalance, useConnect } from 'wagmi'
import { MetaMaskConnector, CoinbaseWalletConnector, InjectedConnector } from 'wagmi/connectors'

export default function WalletAnalyzer() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { connect } = useConnect()

  const [walletError, setWalletError] = useState<string | null>(null)

  const handleConnect = (connector: any) => {
    connect({ connector }).catch(err => setWalletError(err.message))
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg w-96">
      <h2 className="text-xl font-bold mb-4">🐋 Base Wallet Analyzer</h2>

      {!isConnected ? (
        <div className="space-y-2">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 rounded py-2"
            onClick={() => handleConnect(new MetaMaskConnector())}
          >
            Connect MetaMask
          </button>
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 rounded py-2"
            onClick={() => handleConnect(new CoinbaseWalletConnector({ chains: [] }))}
          >
            Connect Coinbase Wallet
          </button>
          <button
            className="w-full bg-gray-600 hover:bg-gray-700 rounded py-2"
            onClick={() => handleConnect(new InjectedConnector({ chains: [] }))}
          >
            Connect Other Wallet
          </button>
          {walletError && <p className="text-red-500 mt-2">{walletError}</p>}
        </div>
      ) : (
        <div>
          <p>Connected Address: {address}</p>
          <p>ETH Balance: {balance?.formatted ?? '0.0'} {balance?.symbol}</p>
        </div>
      )}
    </div>
  )
}
