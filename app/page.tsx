"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-b from-[#020617] to-[#020024]">
      <h1 className="text-3xl font-bold mb-4">🐋 Whale Check</h1>

      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
          className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 font-semibold"
        >
          Connect Wallet 🔗
        </button>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">
            Connected:
            <br />
            <span className="text-white font-mono">
              {address}
            </span>
          </p>

          <button
            onClick={() => disconnect()}
            className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 font-semibold"
          >
            Disconnect
          </button>
        </>
      )}
    </main>
  );
}
