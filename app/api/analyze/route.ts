import { NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { getTokenTransfers } from '@/lib/alchemy'

const client = createPublicClient({
  chain: base,
  transport: http(process.env.ALCHEMY_URL),
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: "No address provided" })
  }

  try {
    // 1️⃣ Transaction Count
    const txCount = Number(
      await client.getTransactionCount({
        address: address as `0x${string}`,
      })
    )

    // 2️⃣ ETH Balance
    const balanceWei = await client.getBalance({
      address: address as `0x${string}`,
    })

    const balance = Number(balanceWei) / 1e18

    // 3️⃣ ERC20 Transfers
    const transfers = await getTokenTransfers(address)

    let tokenVolumeUSD = 0

    for (const tx of transfers) {
      if (tx.value && tx.metadata?.price) {
        tokenVolumeUSD += Number(tx.value) * Number(tx.metadata.price)
      }
    }

    // 4️⃣ Classification Logic
    let type = "🐟 Shrimp"

    if (tokenVolumeUSD > 500000 || txCount > 8000)
      type = "🐋 Whale"
    else if (tokenVolumeUSD > 50000 || txCount > 2000)
      type = "🐬 Dolphin"

    return NextResponse.json({
      txCount,
      balance,
      tokenVolumeUSD,
      type
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Whale analysis failed" })
  }
}
