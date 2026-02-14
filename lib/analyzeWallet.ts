import { ethers } from "ethers"

const RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC!

export async function analyzeWallet(address: string) {
  const provider = new ethers.JsonRpcProvider(RPC_URL)

  const balance = await provider.getBalance(address)
  const balanceInEth = ethers.formatEther(balance)

  const txCount = await provider.getTransactionCount(address)

  return {
    address,
    balance: balanceInEth,
    transactionCount: txCount,
    score: calculateScore(Number(balanceInEth), txCount),
  }
}

function calculateScore(balance: number, txCount: number) {
  let score = 0

  if (balance > 1) score += 40
  if (balance > 5) score += 20

  if (txCount > 10) score += 20
  if (txCount > 50) score += 20

  return Math.min(score, 100)
}
