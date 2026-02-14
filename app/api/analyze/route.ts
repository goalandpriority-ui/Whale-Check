import { NextRequest, NextResponse } from "next/server"
import { analyzeWallet } from "@/lib/analyzeWallet"

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json()

    if (!address) {
      return NextResponse.json(
        { error: "Address required" },
        { status: 400 }
      )
    }

    const result = await analyzeWallet(address)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
