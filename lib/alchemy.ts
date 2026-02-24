import { Alchemy, Network } from "alchemy-sdk";

const apiKey = process.env.ALCHEMY_API_KEY;

if (!apiKey) {
  throw new Error("Missing ALCHEMY_API_KEY");
}

export const alchemy = new Alchemy({
  apiKey,
  network: Network.BASE_MAINNET,
});
