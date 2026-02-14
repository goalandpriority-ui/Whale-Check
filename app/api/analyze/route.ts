import { NextResponse } from "next/server"
import { analyzeWallet } from "../../../lib/analyzeWallet"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Address required" }, { status: 400 })
  }

  try {
    const result = await analyzeWallet(address)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze wallet" },
      { status: 500 }
    )
  }
}
