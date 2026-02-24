'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { base } from 'wagmi/chains'

export default function Home() {
  const { address } = useAccount()
  const { connect } = useConnect({
    connector: new WalletConnectConnector({
      chains: [base],
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
      }
    })
  })

  const { disconnect } = useDisconnect()

  return (
    <div>
      {address ? (
        <>
          <p>Connected: {address}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </>
      ) : (
        <button onClick={() => connect()}>Connect Base Wallet</button>
      )}
    </div>
  )
}
