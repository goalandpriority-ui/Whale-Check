'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'

const leaderboardData = [
  { rank: 1, address: '0xAAA...111', balance: '520 ETH' },
  { rank: 2, address: '0xBBB...222', balance: '410 ETH' },
  { rank: 3, address: '0xCCC...333', balance: '300 ETH' },
]

export default function Page() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <main style={{ padding: 20 }}>
      <h1>🐳 Whale Check</h1>

      {/* WALLET SECTION */}
      {!isConnected && (
        <>
          <p>Wallet not connected</p>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              style={{ marginBottom: 10 }}
            >
              Connect Wallet
            </button>
          ))}
        </>
      )}

      {isConnected && (
        <>
          <p><b>Connected Wallet:</b></p>
          <p>{address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      )}

      <hr style={{ margin: '20px 0' }} />

      {/* LEADERBOARD */}
      <h2>🏆 Whale Leaderboard</h2>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Wallet</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user) => (
            <tr key={user.rank}>
              <td>{user.rank}</td>
              <td>{user.address}</td>
              <td>{user.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
