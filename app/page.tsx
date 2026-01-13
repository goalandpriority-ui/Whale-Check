'use client';

import { useAccount, useBalance } from 'wagmi';

export default function Home() {
  const { address, isConnected } = useAccount();

  const { data: balance, isLoading } = useBalance({
    address,
    enabled: isConnected,
  });

  const ethBalance = balance
    ? Number(balance.formatted)
    : 0;

  const isWhale = ethBalance >= 5;

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#020617',
        color: 'white',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        🐳 Whale Check
      </h1>

      {!isConnected && (
        <p>Connect your wallet to check whale status</p>
      )}

      {isConnected && (
        <>
          <p>
            <strong>Wallet:</strong>{' '}
            {address?.slice(0, 6)}...
            {address?.slice(-4)}
          </p>

          <p>
            <strong>Balance:</strong>{' '}
            {isLoading ? 'Loading...' : `${ethBalance} ETH`}
          </p>

          <h2 style={{ marginTop: '20px' }}>
            {isWhale ? '🐳 You are a WHALE!' : '🐟 You are NOT a whale'}
          </h2>
        </>
      )}
    </main>
  );
}
