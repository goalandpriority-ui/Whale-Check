import { NextResponse } from 'next/server'
import { baseClient } from '@/lib/baseRpc'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'No address provided' })
  }

  try {
    // 1️⃣ Get Transaction Count
    const txCount = Number(
      await baseClient.getTransactionCount({
        address: address as `0x${string}`,
      })
    )

    // 2️⃣ Get ETH Balance
    const balanceWei = await baseClient.getBalance({
      address: address as `0x${string}`,
    })

    const balance = Number(balanceWei) / 1e18

    // 3️⃣ Estimate Recent Volume (last 300 blocks)
    const latestBlock = await baseClient.getBlockNumber()
    let volume = 0

    for (let i = 0; i < 300; i++) {
      const block = await baseClient.getBlock({
        blockNumber: latestBlock - BigInt(i),
        includeTransactions: true,
      })

      for (const tx of block.transactions) {
        if (
          tx.from?.toLowerCase() === address.toLowerCase() ||
          tx.to?.toLowerCase() === address.toLowerCase()
        ) {
          volume += Number(tx.value) / 1e18
        }
      }
    }

    // 4️⃣ Classification
    let type = "🐟 Shrimp"
    if (txCount > 5000 || volume > 1000) type = "🐋 Whale"
    else if (txCount > 1000 || volume > 100) type = "🐬 Dolphin"

    return NextResponse.json({
      txCount,
      balance,
      volume,
      type,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to analyze wallet' })
  }
}
