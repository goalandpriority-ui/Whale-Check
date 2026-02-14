import axios from 'axios'

const ALCHEMY_URL = process.env.ALCHEMY_URL!

export async function getTokenTransfers(address: string) {
  const response = await axios.post(ALCHEMY_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "alchemy_getAssetTransfers",
    params: [{
      fromBlock: "0x0",
      toBlock: "latest",
      fromAddress: address,
      category: ["erc20"],
      withMetadata: true
    }]
  })

  return response.data.result.transfers
}
