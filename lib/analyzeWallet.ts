import { ethers } from "ethers"

const RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC!

export async function analyzeWallet(address: string) {
  const provider = new ethers.JsonRpcProvider(RPC_URL)

  const balance = await provider.getBalance(address)
  const balanceInEth = Number(ethers.formatEther(balance))

  let category = "Shrimp 🦐"

  if (balanceInEth > 1) category = "Dolphin 🐬"
  if (balanceInEth > 5) category = "Whale 🐳"
  if (balanceInEth > 20) category = "Big Whale 🐋🔥"

  return {
    address,
    balance: balanceInEth,
    category,
  }
}
