import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC;

    if (!rpcUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_BASE_RPC is missing in environment variables" },
        { status: 500 }
      );
    }

    const address = req.nextUrl.searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Wallet address required" },
        { status: 400 }
      );
    }

    // Basic address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    let allTransfers: any[] = [];
    let pageKey: string | undefined = undefined;

    // 🔥 Pagination loop (important)
    do {
      const alchemyRes = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getAssetTransfers",
          params: [
            {
              fromBlock: "0x0",
              toBlock: "latest",
              fromAddress: address,
              category: ["external", "internal", "erc20"],
              excludeZeroValue: true,
              withMetadata: true,
              pageKey,
            },
          ],
        }),
        cache: "no-store",
      });

      if (!alchemyRes.ok) {
        throw new Error("Failed to fetch data from Alchemy");
      }

      const alchemyData = await alchemyRes.json();

      if (alchemyData.error) {
        throw new Error(alchemyData.error.message);
      }

      const transfers = alchemyData?.result?.transfers ?? [];
      allTransfers.push(...transfers);

      pageKey = alchemyData?.result?.pageKey;

    } while (pageKey);

    let totalEth = 0;
    let erc20Transactions = 0;
    let totalErc20Usd = 0;

    for (const tx of allTransfers) {
      if (
        (tx.category === "external" || tx.category === "internal") &&
        tx.value
      ) {
        totalEth += Number(tx.value) || 0;
      }

      if (tx.category === "erc20") {
        erc20Transactions++;
        if (tx.metadata?.valueUsd) {
          totalErc20Usd += Number(tx.metadata.valueUsd) || 0;
        }
      }
    }

    // 🔥 ETH Price Fetch (safe)
    let ethPrice = 0;

    try {
      const priceRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
        { cache: "no-store" }
      );
      const priceData = await priceRes.json();
      ethPrice = priceData?.ethereum?.usd ?? 0;
    } catch {
      ethPrice = 0;
    }

    const totalEthUsd = totalEth * ethPrice;
    const totalUsd = totalEthUsd + totalErc20Usd;

    // 🐋 Better Whale Tier
    let status = "Small Fish 🐟";

    if (totalUsd >= 1000000) status = "Mega Whale 🦈";
    else if (totalUsd >= 100000) status = "Whale 🐋";
    else if (totalUsd >= 10000) status = "Shark 🦈";
    else if (totalUsd >= 1000) status = "Dolphin 🐬";

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
      { error: error?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
