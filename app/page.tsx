"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

type Whale = {
  address: string;
  balance: string;
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  const [whales, setWhales] = useState<Whale[]>([
    { address: "0xAAA...111", balance: "520.0000" },
    { address: "0xBBB...222", balance: "410.0000" },
    { address: "0xCCC...333", balance: "300.0000" },
  ]);

  return (
    <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🐋 Whale Check</h1>

      <div style={{ marginBottom: "20px" }}>
        {!isConnected ? (
          <>
            <p>Wallet not connected</p>
            <button onClick={() => connect()}>Connect Wallet</button>
          </>
        ) : (
          <>
            <p>
              Connected Wallet: <br />
              <code>{address}</code>
            </p>
            <button onClick={() => disconnect()}>Disconnect Wallet</button>
          </>
        )}
      </div>

      <h2>🏆 Whale Leaderboard</h2>
      <table
        border={1}
        cellPadding={8}
        style={{ borderCollapse: "collapse", width: "100%", maxWidth: "400px" }}
      >
        <thead>
          <tr>
            <th>Rank</th>
            <th>Wallet</th>
            <th>Balance (ETH)</th>
          </tr>
        </thead>
        <tbody>
          {whales.map((whale, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{whale.address}</td>
              <td>{whale.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
