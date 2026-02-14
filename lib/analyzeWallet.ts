import { ethers } from "ethers";
import { alchemy } from "./alchemy";

export type WalletCategory = "Shrimp" | "Dolphin" | "Whale" | "Big Whale";

export async function analyzeWallet(address: string) {
  // TODO: Replace with real ERC20 outgoing volume
  let totalVolume = 0;
  let txCount = 0;

  // Category logic
  let category: WalletCategory = "Shrimp";
  if (totalVolume >= 5000) category = "Big Whale";
  else if (totalVolume >= 3000) category = "Whale";
  else if (totalVolume >= 1000) category = "Dolphin";

  return { txCount, totalVolume, category };
}
