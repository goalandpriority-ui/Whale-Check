'use client';

import { useAccount, useBalance } from 'wagmi';

export default function Page() {
  const { address, isConnected } = useAccount();

  const { data: balanceData, isLoading } = useBalance({
    address: address,
    chainId: 8453, // Base mainnet
    query: {
      enabled: isConnected && !!address,
    },
  });

  return (
    <main style={{ padding: 24 }}>
      <h1>Whale Check</h1>

      {!isConnected && <p>Wallet connect pannala</p>}

      {isConnected && (
        <>
          <p>
            <b>Address:</b> {address}
          </p>

          {isLoading && <p>Balance load aagudhu...</p>}

          {balanceData && (
            <p>
              <b>Balance:</b> {balanceData.formatted} {balanceData.symbol}
            </p>
          )}
        </>
      )}
    </main>
  );
}
