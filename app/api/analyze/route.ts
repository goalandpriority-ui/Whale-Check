import { NextResponse } from "next/server"
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk"

const config = {
  apiKey: process.env.ALCHEMY_KEY!,
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

export async function POST(req: Request) {
  const { address } = await req.json()

  if (!address) {
    return NextResponse.json({ error: "No address" }, { status: 400 })
  }

  let pageKey: string | undefined = undefined
  let allTransfers: any[] = []

  do {
    const res = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toBlock: "latest",
      fromAddress: address,
      category: [AssetTransfersCategory.ERC20],
      withMetadata: true,
      pageKey,
    })

    allTransfers.push(...res.transfers)
    pageKey = res.pageKey
  } while (pageKey)

  return NextResponse.json({
    totalTransfers: allTransfers.length,
  })
}
