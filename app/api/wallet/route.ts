import { NextRequest, NextResponse } from "next/server";
import { alchemy } from "@/lib/alchemy";

export async function GET(req: NextRequest) {
  try {
    const address = req.nextUrl.searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    // 🔥 Fetch transfers using Alchemy SDK
    const response = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toBlock: "latest",
      fromAddress: address,
      category: ["external", "internal", "erc20"],
      withMetadata: true,
      excludeZeroValue: true,
    });

    const transfers = response.transfers || [];

    let totalEth = 0;
    let erc20Transactions = 0;
    let totalErc20Usd = 0;

    for (const tx of transfers) {
      if (
        (tx.category === "external" || tx.category === "internal") &&
        tx.value
      ) {
        totalEth += Number(tx.value);
      }

      if (tx.category === "erc20") {
        erc20Transactions++;
        if (tx.metadata?.valueUsd) {
          totalErc20Usd += Number(tx.metadata.valueUsd);
        }
      }
    }

    // 🔥 ETH price
    const priceRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { cache: "no-store" }
    );

    const priceData = await priceRes.json();
    const ethPrice = priceData?.ethereum?.usd ?? 0;

    const totalEthUsd = totalEth * ethPrice;
    const totalUsd = totalEthUsd + totalErc20Usd;

    let status = "Small Fish 🐟";

    if (totalUsd >= 1000000) status = "Mega Whale 🦈";
    else if (totalUsd >= 100000) status = "Whale 🐋";
    else if (totalUsd >= 10000) status = "Shark 🦈";
    else if (totalUsd >= 1000) status = "Dolphin 🐬";

    return NextResponse.json({
      wallet: address,
      totalTransactions: transfers.length,
      ethVolume: totalEth.toFixed(4),
      ethUsd: totalEthUsd.toFixed(2),
      erc20Transactions,
      erc20UsdVolume: totalErc20Usd.toFixed(2),
      totalUsd: totalUsd.toFixed(2),
      ethPrice,
      status,
    });
  } catch (error: any) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: error?.message ?? "Failed to fetch data from Alchemy" },
      { status: 500 }
    );
  }
}
