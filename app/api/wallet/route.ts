import { NextResponse } from "next/server";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  process.env.ALCHEMY_RPC!
);

// 🔥 Change token if needed (Currently USDC on Base)
const TOKEN_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// USDC decimals = 6
const TOKEN_DECIMALS = 6;

const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

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
    const fromBlock = latestBlock - 100000; // 🔥 Scan larger range

    const topic = ethers.id("Transfer(address,address,uint256)");
    const paddedAddress = ethers.zeroPadValue(address, 32);

    // ✅ Incoming Transfers
    const incoming = await provider.getLogs({
      address: TOKEN_ADDRESS,
      fromBlock,
      toBlock: latestBlock,
      topics: [topic, null, paddedAddress],
    });

    // ✅ Outgoing Transfers
    const outgoing = await provider.getLogs({
      address: TOKEN_ADDRESS,
      fromBlock,
      toBlock: latestBlock,
      topics: [topic, paddedAddress],
    });

    const allLogs = [...incoming, ...outgoing];

    const iface = new ethers.Interface(ERC20_ABI);

    let totalVolume = 0n;

    allLogs.forEach((log) => {
      try {
        const parsed = iface.parseLog(log);
        if (parsed) {
          totalVolume += parsed.args.value as bigint;
        }
      } catch {
        // ignore invalid logs
      }
    });

    const isWhale =
      totalVolume > ethers.parseUnits("100000", TOKEN_DECIMALS);

    return NextResponse.json({
      transactions: allLogs.length,
      volume: ethers.formatUnits(totalVolume, TOKEN_DECIMALS),
      whale: isWhale,
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
