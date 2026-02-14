import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_RPC?.split("/v2/")[1],
  network: Network.ETH_MAINNET, // Base network uses Ethereum mainnet RPC
};

export const alchemy = new Alchemy(config);
