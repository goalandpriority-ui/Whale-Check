import { NextRequest, NextResponse } from "next/server";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

export async function GET(req: NextRequest) {
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC;

    if (!rpcUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_BASE_RPC is missing in environment variables" },
        { status: 500 }
      );
    }

    const web3 = createAlchemyWeb3(rpcUrl);

    const address = req.nextUrl.searchParams.get("address");
    if (!address) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    // Fetch normal and internal transfers
    const transfers = await web3.alchemy.getAssetTransfers({
      fromBlock: "0x0",
      toBlock: "latest",
      fromAddress: address,
      category: ["external", "internal", "erc20"],
      withMetadata: true,
      excludeZeroValue: true,
    });

    const allTransfers = transfers.transfers || [];

    let totalEth = 0;
    let erc20Transactions = 0;
    let totalErc20Usd = 0;

    allTransfers.forEach((tx: any) => {
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
    });

    // Get ETH price
    const priceRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const priceData = await priceRes.json();
    const ethPrice = priceData?.ethereum?.usd ?? 0;

    const totalEthUsd = totalEth * ethPrice;
    const totalUsd = totalEthUsd + totalErc20Usd;

    let status = "Small Fish 🐟";
    if (totalUsd > 1000000) status = "Mega Whale 🦈";
    else if (totalUsd > 100000) status = "Whale 🐋";
    else if (totalUsd > 10000) status = "Shark 🦈";
    else if (totalUsd > 1000) status = "Dolphin 🐬";

    return NextResponse.json({
      wallet: address,
      totalTransactions: allTransfers.length,
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
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
