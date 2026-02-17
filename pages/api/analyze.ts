import type { NextApiRequest, NextApiResponse } from 'next'
import { Alchemy, Network, AssetTransfersCategory } from 'alchemy-sdk'

const config = {
  apiKey: process.env.ALCHEMY_KEY!,
  network: Network.BASE_MAINNET,
}

const alchemy = new Alchemy(config)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { address } = req.body

  if (!address) return res.status(400).json({ error: 'No address provided' })

  let allTransfers: any[] = []
  let pageKey: string | undefined = undefined

  try {
    do {
      const response = await alchemy.core.getAssetTransfers({
        fromBlock: '0x0',
        toBlock: 'latest',
        fromAddress: address,
        category: [AssetTransfersCategory.ERC20],
        withMetadata: true,
        pageKey,
      })

      allTransfers.push(...response.transfers)
      pageKey = response.pageKey
    } while (pageKey)

    res.status(200).json({ totalTransfers: allTransfers.length })
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Alchemy API error' })
  }
}
