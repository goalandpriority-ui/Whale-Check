'use client'

import { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'

interface LeaderboardEntry {
  wallet: string
  balance: number
}

export default function Page() {
  const { address } = useAccount()
  const { data: balanceData } = useBalance({
    address,
  })

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { wallet: '0xAAA...111', balance: 520 },
    { wallet: '0xBBB...222', balance: 410 },
    { wallet: '0xCCC...333', balance: 300 },
  ])

  useEffect(() => {
    if (!address || !balanceData) return

    const balanceEth = Number(
      parseFloat(balanceData.formatted || '0').toFixed(4)
    )

    if (balanceEth < 5) return

    setLeaderboard((prev) => {
      const alreadyExists = prev.find(
        (item) => item.wallet.toLowerCase() === address.toLowerCase()
      )

      if (alreadyExists) return prev

      const updated = [
        ...prev,
        {
          wallet: address,
          balance: balanceEth,
        },
      ]

      return updated.sort((a, b) => b.balance - a.balance)
    })
  }, [address, balanceData])

  return (
    <main style={{ padding: 20 }}>
      <h1>🐋 Whale Check</h1>
      <p>
        Connected Wallet:{' '}
        {address ? address : 'Wallet not connected'}
      </p>
      {!address && <button>Connect Wallet</button>}

      <hr />

      <h2>🏆 Whale Leaderboard</h2>

      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Wallet</th>
            <th>Balance (ETH)</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.wallet}>
              <td>{index + 1}</td>
              <td>{entry.wallet}</td>
              <td>{entry.balance.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
