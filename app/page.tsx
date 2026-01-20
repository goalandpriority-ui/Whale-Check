'use client'

import { useEffect, useState } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
} from 'wagmi'
import { injected } from 'wagmi/connectors'

type LeaderboardItem = {
  wallet: string
  balance: number
}

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const { data: balanceData } = useBalance({
    address,
  })

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([
    { wallet: '0xAAA...111', balance: 520 },
    { wallet: '0xBBB...222', balance: 410 },
    { wallet: '0xCCC...333', balance: 300 },
  ])

  // 👉 Auto add connected wallet to leaderboard
  useEffect(() => {
    if (!address || !balanceData) return

    const balanceEth = Number(balanceData.formatted)

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

      // sort by balance desc
      return updated.sort((a, b) => b.balance - a.balance)
    })
  }, [address, balanceData])

  return (
    <main style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🐳 Whale Check</h1>

      {!isConnected && (
        <>
          <p>Wallet not connected</p>
          <button onClick={() => connect({ connector: injected() })}>
            Connect Wallet
          </button>
        </>
      )}

      {isConnected && (
        <>
          <p>
            <strong>Connected Wallet:</strong>
            <br />
            {address}
          </p>

          {balanceData && (
            <p>
              <strong>Balance:</strong>{' '}
              {balanceData.formatted} {balanceData.symbol}
            </p>
          )}

          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      )}

      <hr style={{ margin: '30px 0' }} />

      <h2>🏆 Whale Leaderboard</h2>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Wallet</th>
            <th>Balance (ETH)</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((item, index) => (
            <tr key={item.wallet}>
              <td>{index + 1}</td>
              <td>
                {item.wallet.length > 12
                  ? `${item.wallet.slice(0, 6)}...${item.wallet.slice(-4)}`
                  : item.wallet}
              </td>
              <td>{item.balance.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
