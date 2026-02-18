import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  address: string;
  totalVolume: number;
  txCount: number;
  category: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address } = req.body;

  if (!address || address.trim() === "") {
    return res.status(400).json({ error: "Address required" });
  }

  // 🔥 Temporary demo logic (you can replace with real RPC later)
  const txCount = 250; 
  const totalVolume = 120; // ETH

  let category = "🦐 Shrimp";

  if (totalVolume >= 1000) {
    category = "🐳 Big Whale";
  } else if (totalVolume >= 200) {
    category = "🐋 Whale";
  } else if (totalVolume >= 50) {
    category = "🐬 Dolphin";
  } else {
    category = "🦐 Shrimp";
  }

  res.status(200).json({
    address,
    totalVolume,
    txCount,
    category,
  });
}
