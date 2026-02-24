// app/api/wallet/route.ts

import { NextResponse } from 'next/server';
import { Alchemy, Network, SortingOrder } from 'alchemy-sdk';
import { getWhaleTier } from '@/lib/whale-tier'; // make sure lib/whale-tier.ts irukku

// Alchemy config
const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fromBlock = searchParams.get('fromBlock') || '0x0';
    const toBlock = searchParams.get('toBlock') || 'latest';
    const pageKey = searchParams.get('pageKey') || undefined;
    const walletAddress = searchParams.get('address'); // optional

    // Fetch asset transfers
    const res = await alchemy.core.getAssetTransfers({
      fromBlock,
      toBlock,
      toAddress: walletAddress || undefined,
      maxCount: 1000,
      pageKey,
      order: 'desc' as SortingOrder, // ✅ TypeScript fix
    });

    const transfers = res.transfers ?? [];

    // Sum USD volume (all tokens combined)
    const totalUSDVolume = transfers.reduce(
      (acc, tx) => acc + (tx.value?.usd ?? 0),
      0
    );

    // Determine whale tier
    const tier = getWhaleTier(totalUSDVolume);

    return NextResponse.json({
      transfers,
      totalUSDVolume,
      tier,
      pageKey: res.pageKey,
    });
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transfers' },
      { status: 500 }
    );
  }
}
