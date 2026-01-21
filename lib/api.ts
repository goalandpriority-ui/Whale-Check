export async function fetchTransactionsAndVolume(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "1" || !data.result) {
      return { transactions: 0, volume: 0 };
    }

    const transactions = data.result.length;

    const volume = data.result.reduce((acc: number, tx: any) => {
      return acc + Number(tx.value) / 1e18;
    }, 0);

    return { transactions, volume };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { transactions: 0, volume: 0 };
  }
}
