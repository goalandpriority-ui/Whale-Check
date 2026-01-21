// lib/basescan.ts

const BASESCAN_API = "https://api.basescan.org/api";
const API_KEY = process.env.NEXT_PUBLIC_BASESCAN_API_KEY!;

export async function getWalletStats(address: string) {
  try {
    const txRes = await fetch(
      `${BASESCAN_API}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${API_KEY}`
    );

    const txData = await txRes.json();

    if (txData.status !== "1") {
      return {
        txCount: 0,
        totalVolumeEth: "0",
      };
    }

    const transactions = txData.result as any[];

    const txCount = transactions.length;

    let totalWei = BigInt(0);
    for (const tx of transactions) {
      totalWei += BigInt(tx.value);
    }

    // ✅ Safe ETH conversion
    const ethString =
      totalWei / BigInt(1e14); // keep 4 decimals
    const totalVolumeEth = (Number(ethString) / 1e4).toFixed(4);

    return {
      txCount,
      totalVolumeEth,
    };
  } catch (error) {
    console.error("BaseScan error:", error);
    return {
      txCount: 0,
      totalVolumeEth: "0",
    };
  }
}
