// lib/whale-tier.ts

export type WhaleTier = 'Small Fish 🐟' | 'Dolphin 🐬' | 'Whale 🐋' | 'Mega Whale 🦈' | 'No Activity 💤';

export function getWhaleTier(totalUSDVolume: number): WhaleTier {
  if (totalUSDVolume <= 0) return 'No Activity 💤';
  if (totalUSDVolume < 1000) return 'Small Fish 🐟';
  if (totalUSDVolume >= 1000 && totalUSDVolume < 5000) return 'Dolphin 🐬';
  if (totalUSDVolume >= 5000 && totalUSDVolume < 10000) return 'Whale 🐋';
  return 'Mega Whale 🦈'; // 10000+
}
