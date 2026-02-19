// components/WhaleChecker.tsx
'use client'

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { alchemyApiKey } from '../lib/config'
import { Alchemy, Network } from 'alchemy-sdk'

interface WalletStats {
  ethBalance: string
  ethUsd: string
  totalTx: number
  erc20Tx: number
  erc20Usd: string
  whaleStatus: string
}

export default function WhaleChecker({ address }: { address: string }) {
  const [stats, setStats] = useState<WalletStats>({
    ethBalance: '0.0000',
    ethUsd: '0.00',
    totalTx: 0,
    erc20Tx: 0,
    erc20Usd: '0.00',
    whaleStatus: 'Small Fish',
  })

  useEffect(() => {
    if (!address) return

    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_RPC)

    const alchemy = new Alchemy({
      apiKey: alchemyApiKey,
      network: Network.ETH_MAINNET, // adjust if using Base chain
    })

    const fetchData = async () => {
      try {
        // 1️⃣ ETH Balance
        const balance = await provider.getBalance(address)
        const ethBalance = ethers.formatEther(balance)

        // 2️⃣ Total Transactions
        const totalTx = await provider.getTransactionCount(address)

        // 3️⃣ ERC20 Transfers
        const erc20Transfers = await alchemy.transfers.getTransfers({
          fromAddress: address,
          toAddress: address,
        })
        const erc20Tx = erc20Transfers.transfers.length

        // 4️⃣ ETH USD Value
        const ethPrice = 1976.55 // replace with API if needed
        const ethUsd = (parseFloat(ethBalance) * ethPrice).toFixed(2)

        // 5️⃣ ERC20 USD Volume (simplified)
        let erc20Usd = 0
        erc20Transfers.transfers.forEach((t) => {
          const value = parseFloat(ethers.formatUnits(t.value, t.token.decimals))
          const price = t.token.price?.usd || 0
          erc20Usd += value * price
        })

        // 6️⃣ Whale Status
        const whaleStatus =
          parseFloat(ethBalance) > 10
            ? 'Whale'
            : parseFloat(ethBalance) > 1
            ? 'Dolphin'
            : 'Small Fish'

        setStats({
          ethBalance: parseFloat(ethBalance).toFixed(4),
          ethUsd,
          totalTx,
          erc20Tx,
          erc20Usd: erc20Usd.toFixed(2),
          whaleStatus,
        })
      } catch (err) {
        console.error('Error fetching wallet stats:', err)
      }
    }

    fetchData()
  }, [address])

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
      <h2>Whale Check</h2>
      <p>Connected: {address}</p>

      <hr />
      <h3>Wallet Stats</h3>
      <p>Total Transactions: {stats.totalTx}</p>

      <hr />
      <h3>ETH Activity</h3>
      <p>ETH Balance: {stats.ethBalance} ETH</p>
      <p>ETH USD Value: ${stats.ethUsd}</p>

      <hr />
      <h3>ERC20 Activity</h3>
      <p>ERC20 Transactions: {stats.erc20Tx}</p>
      <p>ERC20 USD Volume: ${stats.erc20Usd}</p>

      <hr />
      <h3>Whale Status: {stats.whaleStatus}</h3>
    </div>
  )
}
