import { NextRequest, NextResponse } from "next/server";
import { analyzeWallet } from "@/lib/analyzeWallet";

export async function POST(req: NextRequest) {
  const { wallet } = await req.json();

  if (!wallet) return NextResponse.json({ error: "Wallet address required" }, { status: 400 });

  try {
    const result = await analyzeWallet(wallet);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Failed to analyze wallet" }, { status: 500 });
  }
}
