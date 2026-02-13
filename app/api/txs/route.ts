import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) return NextResponse.json({ error: 'No address provided' }, { status: 400 })

  const apiKey = process.env.NEXT_PUBLIC_BASESCAN_API_KEY
  const txUrl = `https://api.basescan.org/api/v2?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`

  try {
    const txRes = await fetch(txUrl)
    const txData = await txRes.json()

    if (txData.status !== "1") return NextResponse.json({ txCount: 0, txs: [] })

    // Calculate total ETH sent
    const txs = txData.result
    let totalEth = 0
    for (const tx of txs) {
      totalEth += parseFloat(tx.value) / 1e18 // wei to ETH
    }

    // Fetch ETH price in USD
    const priceRes = await fetch(process.env.NEXT_PUBLIC_ETH_PRICE_API!)
    const priceData = await priceRes.json()
    const ethPrice = parseFloat(priceData.data.amount)
    const totalUSD = totalEth * ethPrice

    return NextResponse.json({
      txCount: txs.length,
      totalEth,
      totalUSD,
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json({ txCount: 0, totalEth: 0, totalUSD: 0 })
  }
      }
