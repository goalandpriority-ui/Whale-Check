import { NextResponse } from "next/server";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  process.env.ALCHEMY_RPC!
);

const TOKEN_ADDRESS = "0xYourTokenAddressHere";

const ERC20_ABI = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

export async function GET() {
  try {
    const contract = new ethers.Contract(
      TOKEN_ADDRESS,
      ERC20_ABI,
      provider
    );

    const latestBlock = await provider.getBlockNumber();

    const logs = await provider.getLogs({
      address: TOKEN_ADDRESS,
      fromBlock: latestBlock - 2000,
      toBlock: latestBlock,
      topics: [ethers.id("Transfer(address,address,uint256)")]
    });

    const parsedLogs = logs
      .map((log) => {
        try {
          const parsed = contract.interface.parseLog(log);
          if (!parsed) return null;

          return {
            from: parsed.args.from as string,
            to: parsed.args.to as string,
            amount: ethers.formatUnits(
              parsed.args.value as bigint,
              18
            ),
            txHash: log.transactionHash,
          };
        } catch {
          return null;
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return NextResponse.json(parsedLogs);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
