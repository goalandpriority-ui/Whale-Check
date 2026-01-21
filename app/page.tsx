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

  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address ?? undefined,
    watch: true,
  });

  const daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  const { data: daiBalance, isLoading: daiLoading } = useBalance({
    address,
    token: daiAddress,
    watch: true,
  });

  const { data: usdtBalance, isLoading: usdtLoading } = useBalance({
    address,
    token: usdtAddress,
    watch: true,
  });

  const { data: usdcBalance, isLoading: usdcLoading } = useBalance({
    address,
    token: usdcAddress,
    watch: true,
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
              key={connector.id}
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
            Address: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>

          <p>
            ETH Balance:{" "}
            {balanceLoading
              ? "Loading..."
              : balance
              ? `${Number(balance.formatted).toFixed(4)} ETH`
              : "No balance"}
          </p>

          <p>
            DAI Balance:{" "}
            {daiLoading
              ? "Loading..."
              : daiBalance
              ? `${Number(daiBalance.formatted).toFixed(4)} DAI`
              : "No DAI"}
          </p>

          <p>
            USDT Balance:{" "}
            {usdtLoading
              ? "Loading..."
              : usdtBalance
              ? `${Number(usdtBalance.formatted).toFixed(4)} USDT`
              : "No USDT"}
          </p>

          <p>
            USDC Balance:{" "}
            {usdcLoading
              ? "Loading..."
              : usdcBalance
              ? `${Number(usdcBalance.formatted).toFixed(4)} USDC`
              : "No USDC"}
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
