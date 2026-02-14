import { Alchemy, Network } from "alchemy-sdk"

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
  network: Network.BASE_MAINNET,
})

function getCategory(totalTx: number, totalVolume: number) {
  if (totalTx >= 5000 && totalVolume >= 5000) return "🐳 Big Whale"
  if (totalTx >= 3000 && totalVolume >= 3000) return "🐋 Whale"
  if (totalTx >= 1000 && totalVolume >= 1000) return "🐬 Dolphin"
  if (totalTx >= 500 && totalVolume >= 500) return "🦐 Shrimp"
  return "🦐 Shrimp"
}

async function getEthPrice() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  )
  const data = await res.json()
  return data.ethereum.usd || 0
}

async function getTokenPrice(contractAddress: string) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/base?contract_addresses=${contractAddress}&vs_currencies=usd`
  )
  const data = await res.json()
  return data[contractAddress.toLowerCase()]?.usd || 0
}

export async function analyzeWallet(address: string) {
  const transfers = await alchemy.core.getAssetTransfers({
    fromBlock: "0x0",
    toBlock: "latest",
    fromAddress: address,
    category: ["external", "erc20"],
  })

  const txList = transfers.transfers
  const totalTx = txList.length

  let totalUSD = 0
  const ethPrice = await getEthPrice()

  for (const tx of txList) {
    if (tx.category === "external" && tx.value) {
      totalUSD += Number(tx.value) * ethPrice
    }

    if (tx.category === "erc20" && tx.rawContract?.decimal && tx.value) {
      const decimals = Number(tx.rawContract.decimal)
      const adjusted =
        Number(BigInt(tx.value)) / 10 ** decimals

      const price = await getTokenPrice(tx.rawContract.address)
      totalUSD += adjusted * price
    }
  }

  return {
    totalTx,
    totalUSD: Number(totalUSD.toFixed(2)),
    category: getCategory(totalTx, totalUSD),
  }
}
