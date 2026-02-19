"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/wallet?address=${address}`);
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [address]);

  return (
    <main style={{ padding: 40 }}>
      <h1>Whale Check 🐋</h1>

      {isConnected ? (
        <>
          <p>Connected: {address}</p>

          {loading && <p>Checking wallet...</p>}

          {data && (
            <div>
              <p>Transactions: {data.transactions}</p>
              <p>Total ETH Volume: {data.ethVolume} ETH</p>
              <p>Total USD Volume: ${data.usdVolume}</p>
              <p>Current ETH Price: ${data.ethPrice}</p>
              <p>Whale Status: {data.status}</p>
            </div>
          )}
        </>
      ) : (
        <p>Connect your wallet</p>
      )}
    </main>
  );
}
