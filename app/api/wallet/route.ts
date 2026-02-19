import { NextResponse } from "next/server";

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

    const response = await fetch(process.env.ALCHEMY_RPC!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            fromAddress: address,
            category: ["external", "erc20"],
            excludeZeroValue: true,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!data.result) {
      return NextResponse.json(
        { error: "Alchemy RPC error" },
        { status: 500 }
      );
    }

    const transfers = data.result.transfers || [];

    let totalVolume = 0;

    for (const tx of transfers) {
      if (tx.value) {
        totalVolume += parseFloat(tx.value);
      }
    }

    const isWhale = totalVolume > 100; // adjust threshold if needed

    return NextResponse.json({
      transactions: transfers.length,
      volume: totalVolume,
      whale: isWhale,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
