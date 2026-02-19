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

    // 1️⃣ Fetch ETH transfers from Alchemy
    const alchemyRes = await fetch(process.env.ALCHEMY_RPC!, {
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
            category: ["external"], // ETH only
            excludeZeroValue: true,
          },
        ],
      }),
    });

    const alchemyData = await alchemyRes.json();

    if (!alchemyData.result) {
      return NextResponse.json(
        { error: "Alchemy RPC error" },
        { status: 500 }
      );
    }

    const transfers = alchemyData.result.transfers || [];

    let totalEth = 0;

    for (const tx of transfers) {
      if (tx.value) {
        totalEth += parseFloat(tx.value); // already in ETH
      }
    }

    // 2️⃣ Get Current ETH Price (USD)
    const priceRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );

    const priceData = await priceRes.json();

    const ethPrice = priceData?.ethereum?.usd;

    if (!ethPrice) {
      return NextResponse.json(
        { error: "Failed to fetch ETH price" },
        { status: 500 }
      );
    }

    // 3️⃣ Convert ETH → USD
    const totalUsd = totalEth * ethPrice;

    // 4️⃣ Whale Tier Classification
    let status = "Small Fish 🐟";

    if (totalUsd >= 10000) {
      status = "Mega Whale 🦈";
    } else if (totalUsd >= 5000) {
      status = "Whale 🐋";
    } else if (totalUsd >= 1000) {
      status = "Dolphin 🐬";
    }

    return NextResponse.json({
      wallet: address,
      transactions: transfers.length,
      ethVolume: totalEth.toFixed(4),
      usdVolume: totalUsd.toFixed(2),
      ethPrice,
      status,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
