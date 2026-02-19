import { NextResponse } from "next/server";
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  process.env.ALCHEMY_RPC
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

    const parsedLogs = logs.map((log) => {
      const parsed = contract.interface.parseLog(log);
      return {
        from: parsed.args.from,
        to: parsed.args.to,
        amount: ethers.formatUnits(parsed.args.value, 18),
        txHash: log.transactionHash
      };
    });

    return NextResponse.json(parsedLogs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
