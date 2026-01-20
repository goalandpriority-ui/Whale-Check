'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { injected } from 'wagmi/connectors'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const balance = useBalance({
    address,
  })

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif' }}>
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

          {balance.data && (
            <p>
              <strong>Balance:</strong>{' '}
              {balance.data.formatted} {balance.data.symbol}
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
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>0xAAA...111</td>
            <td>520 ETH</td>
          </tr>
          <tr>
            <td>2</td>
            <td>0xBBB...222</td>
            <td>410 ETH</td>
          </tr>
          <tr>
            <td>3</td>
            <td>0xCCC...333</td>
            <td>300 ETH</td>
          </tr>
        </tbody>
      </table>
    </main>
  )
}
