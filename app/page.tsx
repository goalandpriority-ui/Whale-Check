'use client'

import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
  useNetwork,
  useSwitchNetwork,
} from 'wagmi'
import { injected } from 'wagmi/connectors'

const BASE_CHAIN_ID = 8453

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const { connect } = useConnect({
    connector: injected(),
  })

  const { disconnect } = useDisconnect()

  const { data: balanceData, isLoading } = useBalance({
    address,
    enabled: !!address && chain?.id === BASE_CHAIN_ID,
  })

  const balanceEth = balanceData
    ? Number(balanceData.formatted)
    : 0

  const getWhaleLevel = (eth: number) => {
    if (eth >= 1) return { label: '🐳 Mega Whale', color: 'purple' }
    if (eth >= 0.5) return { label: '🐋 Whale', color: 'blue' }
    if (eth >= 0.1) return { label: '🐬 Dolphin', color: 'green' }
    if (eth >= 0.05) return { label: '🦐 Shrimp', color: 'orange' }
    return { label: '🐜 Tiny Shrimp', color: 'gray' }
  }

  const whale = getWhaleLevel(balanceEth)

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 32 }}>🐋 Base Whale Check</h1>
      <p>Check whale power on Base</p>

      {!isConnected && (
        <button onClick={() => connect()}>
          Connect Wallet
        </button>
      )}

      {isConnected && chain?.id !== BASE_CHAIN_ID && (
        <>
          <p style={{ color: 'red' }}>
            ⚠️ Please switch to Base Network
          </p>
          <button onClick={() => switchNetwork?.(BASE_CHAIN_ID)}>
            Switch to Base
          </button>
        </>
      )}

      {isConnected && chain?.id === BASE_CHAIN_ID && (
        <>
          <p><strong>Wallet:</strong> {address}</p>

          {isLoading ? (
            <p>Loading balance...</p>
          ) : (
            <>
              <p>
                <strong>Balance:</strong>{' '}
                {balanceEth.toFixed(4)} ETH
              </p>

              <p style={{ color: whale.color, fontSize: 20 }}>
                <strong>Status:</strong> {whale.label}
              </p>
            </>
          )}

          <button onClick={() => disconnect()}>
            Disconnect
          </button>
        </>
      )}
    </main>
  )
}
