import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address } = req.body;

  if (!address || address.trim() === "") {
    return res.status(400).json({ error: "Address required" });
  }

  // 🔥 Simulated real values (Replace later with API)
  const volumeUSD = 3000;        // example $3000
  const transactions = 5200;     // example 5000+ tx

  let category = "🦐 Shrimp";

  if (volumeUSD >= 100000 || transactions >= 5000) {
    category = "🐋 Big Whale";
  } else if (volumeUSD >= 10000 || transactions >= 1000) {
    category = "🐳 Whale";
  } else if (volumeUSD >= 1000 || transactions >= 100) {
    category = "🐬 Dolphin";
  }

  return res.status(200).json({
    address,
    volumeUSD,
    transactions,
    category,
  });
}
