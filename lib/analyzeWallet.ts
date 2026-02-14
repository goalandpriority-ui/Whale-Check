import { ethers } from "ethers";
import { alchemy } from "./alchemy";

export type WalletCategory = "Shrimp" | "Dolphin" | "Whale" | "Big Whale";

export async function analyzeWallet(address: string) {
  const history = await alchemy.nft.getNftsForOwner(address); // Example: fetch NFTs (or ERC20 txs)
  
  // Placeholder logic: replace with real outgoing volume calculation
  let totalVolume = 0; 
  let txCount = 0;

  // TODO: Calculate txCount & totalVolume from ERC20 transfers
  // Use Alchemy SDK ERC20 methods

  // Category logic
  let category: WalletCategory = "Shrimp";
  if (totalVolume >= 5000) category = "Big Whale";
  else if (totalVolume >= 3000) category = "Whale";
  else if (totalVolume >= 1000) category = "Dolphin";

  return { txCount, totalVolume, category };
}
