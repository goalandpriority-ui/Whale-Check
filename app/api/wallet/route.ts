import { NextResponse } from "next/server";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  process.env.ALCHEMY_RPC!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    const latestBlock = await provider.getBlockNumber();
    const fromBlock = latestBlock - 50000;

    let totalVolume = 0n;
    let txCount = 0;

    // 🔥 Scan blocks manually (native ETH transfers)
    for (let i = fromBlock; i <= latestBlock; i++) {
      const block = await provider.getBlock(i, true);

      if (!block || !block.transactions) continue;

      block.transactions.forEach((tx: any) => {
        if (
          tx.from?.toLowerCase() === address.toLowerCase() ||
          tx.to?.toLowerCase() === address.toLowerCase()
        ) {
          totalVolume += BigInt(tx.value);
          txCount++;
        }
      });
    }

    const formattedVolume = ethers.formatEther(totalVolume);

    const isWhale =
      totalVolume > ethers.parseEther("100"); // 🔥 100 ETH whale threshold

    return NextResponse.json({
      transactions: txCount,
      volume: formattedVolume,
      whale: isWhale,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
