// app/api/wallet/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Alchemy, Network, SortingOrder } from "alchemy-sdk";

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, // use Network.ETH_GOERLI for testnet
};

const alchemy = new Alchemy(config);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("address") || undefined;
    const fromBlock = searchParams.get("fromBlock") || "0x0";
    const toBlock = searchParams.get("toBlock") || "latest";
    const pageKey = searchParams.get("pageKey") || undefined;
    const maxCount = 100;
    const order: SortingOrder = "desc";

    // ✅ Fixed: Added 'category' and 'withMetadata'
    const res = await alchemy.core.getAssetTransfers({
      fromBlock,
      toBlock,
      toAddress: walletAddress,
      maxCount,
      pageKey,
      order,
      category: ["external", "erc20", "erc721", "erc1155"],
      withMetadata: true,
    });

    return NextResponse.json({ success: true, data: res });
  } catch (err: any) {
    console.error("Error fetching wallet transfers:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
