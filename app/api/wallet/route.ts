import { NextRequest, NextResponse } from "next/server";
import { Alchemy, Network, SortingOrder, AssetTransfersCategory } from "alchemy-sdk";

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, // or Network.ETH_GOERLI for testnet
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

    // ✅ TypeScript safe SortingOrder
    const order: SortingOrder = SortingOrder.DESCENDING;

    // Fetch asset transfers with metadata + category
    const res = await alchemy.core.getAssetTransfers({
      fromBlock,
      toBlock,
      toAddress: walletAddress,
      maxCount,
      pageKey,
      order,
      category: [
        AssetTransfersCategory.EXTERNAL,
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
        AssetTransfersCategory.ERC1155,
      ],
      withMetadata: true,
    });

    return NextResponse.json({ success: true, data: res });
  } catch (err: any) {
    console.error("Error fetching wallet transfers:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
