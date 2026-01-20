'use client'

import { useAccount, useBalance } from 'wagmi'
import { useEffect, useState } from 'react'

type Whale = {
  address: string
  balance: number
}

export default function Leaderboard() {
  const { address, isConnected } = useAccount()
  const { data } = useBalance({ address })

  const [whales, setWhales] = useState<Whale[]>([])

  useEffect(() => {
    if (!isConnected || !address || !data) return

    setWhales((prev) => {
      const alreadyExists = prev.find((w) => w.address === address)
      if (alreadyExists) return prev

      const updated = [
        ...prev,
        {
          address,
          balance: Number(data.formatted),
        },
      ]

      return updated.sort((a, b) => b.balance - a.balance)
    })
  }, [address, isConnected, data])

  if (whales.length === 0) return null

  return (
    <div style={{ marginTop: '30px', width: '100%', maxWidth: '400px' }}>
      <h3>🐋 Whale Leaderboard</h3>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {whales.map((w, i) => (
          <li
            key={w.address}
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #eee',
              borderRadius: '8px',
            }}
          >
            <b>#{i + 1}</b>
            <br />
            {w.address.slice(0, 6)}...{w.address.slice(-4)}
            <br />
            💰 {w.balance.toFixed(4)} ETH
          </li>
        ))}
      </ul>
    </div>
  )
}
