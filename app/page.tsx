"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
} from "wagmi";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: balance } = useBalance({
    address,
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h1>🐳 Whale Check</h1>

      {!isConnected && (
        <>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isLoading}
              style={{
                padding: "10px 16px",
                background: "#2563eb",
                color: "white",
                borderRadius: "8px",
              }}
            >
              Connect {connector.name}
            </button>
          ))}
        </>
      )}

      {isConnected && (
        <>
          <p>
            Address:{" "}
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>

          <p>
            Balance:{" "}
            {balance
              ? `${Number(balance.formatted).toFixed(4)} ETH`
              : "Loading..."}
          </p>

          <button
            onClick={() => disconnect()}
            style={{
              padding: "10px 16px",
              background: "#dc2626",
              color: "white",
              borderRadius: "8px",
            }}
          >
            Disconnect
          </button>
        </>
      )}
    </main>
  );
}
