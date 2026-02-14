'use client'

import { useAccount, useBalance } from 'wagmi'
import { useEffect, useState } from 'react'

type Whale = {
  address: string
  txCount: number
  volume: number
  category: string
}

export default function Leaderboard() {
  const { address } = useAccount()
  const [walletData, setWalletData] = useState<Whale | null>(null)

  useEffect(() => {
    if (!address) return
    fetch('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ wallet: address }),
    })
      .then(res => res.json())
      .then(data => setWalletData(data))
  }, [address])

  if (!walletData) return <div>Connect wallet to see leaderboard</div>

  return (
    <div>
      <h2>🐋 Whale Leaderboard</h2>
      <p>Address: {walletData.address}</p>
      <p>Transactions: {walletData.txCount}</p>
      <p>Total Volume: ${walletData.volume}</p>
      <p>Category: {walletData.category}</p>
    </div>
  )
}
