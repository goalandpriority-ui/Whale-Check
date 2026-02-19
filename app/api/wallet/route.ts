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

    // 🔥 Fetch ETH + ERC20 transfers from Alchemy
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
            category: ["external", "internal", "erc20"],
            excludeZeroValue: true,
            withMetadata: true,
          },
        ],
      }),
    });

    const alchemyData = await alchemyRes.json();
    const transfers = alchemyData?.result?.transfers || [];

    let totalEth = 0;
    let erc20Transactions = 0;
    let totalErc20Usd = 0;

    for (const tx of transfers) {
      // ✅ ETH Transfers
      if (tx.category === "external" || tx.category === "internal") {
        if (tx.value) {
          totalEth += parseFloat(tx.value);
        }
      }

      // ✅ ERC20 Transfers
      if (tx.category === "erc20") {
        erc20Transactions++;

        // USD value if available
        if (tx.metadata?.valueUsd) {
          totalErc20Usd += parseFloat(tx.metadata.valueUsd);
        }
      }
    }

    // 🔥 Get ETH price
    const priceRes = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const priceData = await priceRes.json();
    const ethPrice = priceData?.ethereum?.usd || 0;

    const totalEthUsd = totalEth * ethPrice;
    const totalUsd = totalEthUsd + totalErc20Usd;

    // 🐋 Whale Tier Logic
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
      totalTransactions: transfers.length,

      // ETH
      ethVolume: totalEth.toFixed(4),
      ethUsd: totalEthUsd.toFixed(2),

      // ERC20
      erc20Transactions,
      erc20UsdVolume: totalErc20Usd.toFixed(2),

      // Combined
      totalUsd: totalUsd.toFixed(2),
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
