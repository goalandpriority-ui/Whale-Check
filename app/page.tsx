'use client'

import WalletStatus from '@/components/WalletStatus'

export default function Page() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
        Base Whale Checker 🐋
      </h1>

      <p style={{ color: '#666', textAlign: 'center', maxWidth: '300px' }}>
        Connect your wallet to check Base chain whale transactions
      </p>

      <WalletStatus />
    </main>
  )
}
