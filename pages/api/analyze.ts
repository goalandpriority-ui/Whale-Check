import type { NextApiRequest, NextApiResponse } from "next";
import { Alchemy, Network, AssetTransfersCategory } from "alchemy-sdk";
import { ethers } from "ethers";

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

function categorizeVolume(volumeUSD: number) {
  if (volumeUSD < 1000) return "Shrimp 🦐";
  if (volumeUSD < 10000) return "Dolphin 🐬";
  if (volumeUSD < 100000) return "Whale 🐋";
  return "Big Whale 🐳";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { address } = req.query;
    if (!address || typeof address !== "string") {
      return res.status(400).json({ error: "Wallet address is required" });
    }

    let pageKey: string | undefined = undefined;
    let allTransactions: any[] = [];

    do {
      const response = await alchemy.transfers.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: address,
        category: [
          AssetTransfersCategory.EXTERNAL,
          AssetTransfersCategory.INTERNAL,
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
        ],
        maxCount: 100,
        pageKey,
      });

      allTransactions = allTransactions.concat(response.transfers);
      pageKey = response.pageKey;
    } while (pageKey);

    const ETH_PRICE = 1800;
    let totalVolumeUSD = 0;
    allTransactions.forEach((tx) => {
      if (!tx.value) return;
      const amount = Number(ethers.formatEther(tx.value || "0"));
      totalVolumeUSD += amount * ETH_PRICE;
    });

    const category = categorizeVolume(totalVolumeUSD);

    // ✅ API la JSON return
    res.status(200).json({
      totalTransactions: allTransactions.length,
      totalVolumeUSD,
      category,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch wallet transactions" });
  }
}
