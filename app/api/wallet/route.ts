import { NextResponse } from "next/server";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  process.env.ALCHEMY_RPC!
);

const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// Example: USDC on Base (change if needed)
const TOKEN_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address required" },
        { status: 400 }
      );
    }

    const latestBlock = await provider.getBlockNumber();

    const topic = ethers.id("Transfer(address,address,uint256)");

    const logs = await provider.getLogs({
      address: TOKEN_ADDRESS,
      fromBlock: latestBlock - 5000,
      toBlock: latestBlock,
      topics: [
        topic,
        null,
        ethers.zeroPadValue(address, 32)
      ],
    });

    let totalVolume = 0n;

    logs.forEach((log) => {
      const parsed = new ethers.Interface(ERC20_ABI).parseLog(log);
      if (parsed) {
        totalVolume += parsed.args.value as bigint;
      }
    });

    return NextResponse.json({
      transactions: logs.length,
      volume: ethers.formatUnits(totalVolume, 6) // USDC decimals 6
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
