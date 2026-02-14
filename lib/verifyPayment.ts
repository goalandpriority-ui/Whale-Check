import { ethers } from "ethers";

export async function verifyPayment(txHash: string, receiver: string, amountETH: string) {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_RPC);
  const tx = await provider.getTransaction(txHash);

  if (!tx) return false;
  if (tx.to?.toLowerCase() !== receiver.toLowerCase()) return false;
  if (Number(ethers.formatEther(tx.value)) < Number(amountETH)) return false;

  return true;
}
