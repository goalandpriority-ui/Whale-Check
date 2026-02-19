// lib/alchemy.ts
import { Alchemy, Network } from 'alchemy-sdk';

// Settings for Alchemy SDK
const settings = {
  apiKey: process.env.ALCHEMY_RPC || '', // from env.local
  network: Network.BASE_MAINNET,        // Base chain
};

export const alchemy = new Alchemy(settings);
