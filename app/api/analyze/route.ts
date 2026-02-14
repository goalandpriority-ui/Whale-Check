import { NextResponse } from "next/server"
import { analyzeWallet } from "../../../lib/analyzeWallet"
import { verifyPayment } from "../../../lib/verifyPayment"

export async function POST(req: Request) {
  const body = await req.json()
  const { address, txHash } = body

  if (!address || !txHash) {
    return NextResponse.json(
      { error: "Address and txHash required" },
      { status: 400 }
    )
  }

  const paid = await verifyPayment(address, txHash)

  if (!paid) {
    return NextResponse.json(
      { error: "Payment not verified" },
      { status: 403 }
    )
  }

  const result = await analyzeWallet(address)

  return NextResponse.json(result)
}
