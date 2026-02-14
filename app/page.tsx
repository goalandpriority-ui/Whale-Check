'use client'
import { useState } from 'react'
import Leaderboard from './components/Leaderboard'

export default function HomePage() {
  const [wallet, setWallet] = useState('')

  return (
    <main style={{ padding: 40, backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
      <h1>🐋 Base Whale Engine</h1>
      <input
        type="text"
        value={wallet}
        onChange={e => setWallet(e.target.value)}
        placeholder="Enter wallet address"
        style={{ padding: 8, width: 300, marginRight: 10 }}
      />
      <Leaderboard />
    </main>
  )
}
