import { ethers } from "ethers"

const RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC!
const RECEIVER = process.env.NEXT_PUBLIC_RECEIVER_WALLET!

export async function verifyPayment(
  userAddress: string,
  txHash: string
) {
  const provider = new ethers.JsonRpcProvider(RPC_URL)

  const tx = await provider.getTransaction(txHash)

  if (!tx) return false

  const valueInEth = Number(ethers.formatEther(tx.value))

  const isCorrectReceiver =
    tx.to?.toLowerCase() === RECEIVER.toLowerCase()

  const isFromUser =
    tx.from.toLowerCase() === userAddress.toLowerCase()

  const minFee = 0.00002 // approx $0.05 on Base (adjust if needed)

  return isCorrectReceiver && isFromUser && valueInEth >= minFee
}
