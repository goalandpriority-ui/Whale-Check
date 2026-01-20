'use client'

import { useAccount, useBalance } from 'wagmi'
import Leaderboard from './components/Leaderboard'

export default function Home() {
  const { address, isConnected } = useAccount()

  const { data: balance, isLoading } = useBalance({
    address,
    enabled: isConnected,
  })

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '40px 16px',
        background: '#0b0b0b',
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
        🐋 Base Whale Check
      </h1>

      <p style={{ opacity: 0.7, marginBottom: '24px' }}>
        Check whale power on Base
      </p>

      {!isConnected && (
        <div
          style={{
            padding: '16px',
            border: '1px dashed #333',
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          🔌 Please connect your wallet
        </div>
      )}

      {isConnected && (
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            border: '1px solid #222',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '30px',
            background: '#111',
          }}
        >
          <p style={{ fontSize: '14px', opacity: 0.7 }}>Connected Wallet</p>
          <p style={{ fontSize: '13px', wordBreak: 'break-all' }}>
            {address}
          </p>

          <div style={{ marginTop: '12px' }}>
            {isLoading ? (
              <p>Loading balance...</p>
            ) : (
              <p style={{ fontSize: '16px' }}>
                💰 Balance:{' '}
                <b>
                  {balance?.formatted} {balance?.symbol}
                </b>
              </p>
            )}
          </div>
        </div>
      )}

      {/* 🔥 STEP 10 – AUTO LEADERBOARD */}
      <Leaderboard />
    </main>
  )
}
