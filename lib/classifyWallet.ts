export type WalletType =
  | "Shrimp 🦐"
  | "Dolphin 🐬"
  | "Whale 🐋"
  | "Mega Whale 🐳"
  | "No Activity ❌";

export function classifyWallet(
  transactions: number,
  volume: number // ETH
): WalletType {
  // No activity or very low
  if (transactions < 10 || volume < 0.1) {
    return "No Activity ❌";
  }

  // Shrimp
  if (
    transactions >= 10 &&
    transactions < 100 &&
    volume >= 0.1 &&
    volume < 1
  ) {
    return "Shrimp 🦐";
  }

  // Dolphin
  if (
    transactions >= 100 &&
    transactions < 500 &&
    volume >= 1 &&
    volume < 1.5
  ) {
    return "Dolphin 🐬";
  }

  // Whale
  if (
    transactions >= 500 &&
    transactions < 5000 &&
    volume >= 2 &&
    volume < 10
  ) {
    return "Whale 🐋";
  }

  // Mega Whale
  if (
    transactions >= 5000 &&
    transactions <= 10000 &&
    volume >= 10 &&
    volume <= 100
  ) {
    return "Mega Whale 🐳";
  }

  // Fallback
  return "No Activity ❌";
}
