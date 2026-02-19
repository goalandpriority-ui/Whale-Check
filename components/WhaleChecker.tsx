'use client'

import { useState } from 'react';
import { alchemy } from '../lib/alchemy';

interface WhaleCheckerProps {
  address: string;
}

interface Transfer {
  blockNum: string;
  from: string;
  to: string;
  value: string;
  tokenSymbol: string;
}

export default function WhaleChecker({ address }: WhaleCheckerProps) {
  const [erc20Transfers, setErc20Transfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTransfers = async () => {
    setLoading(true);
    setError('');

    try {
      // Alchemy SDK v3: ERC20 token transfers
      const response = await alchemy.core.getTokenTransfers({
        fromAddress: address,
        toAddress: address,
      });

      const transfers: Transfer[] = response.transfers.map((t: any) => ({
        blockNum: t.blockNum,
        from: t.from,
        to: t.to,
        value: t.value,
        tokenSymbol: t.asset,
      }));

      setErc20Transfers(transfers);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch transfers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="whale-checker">
      <h2>🐋 Whale Checker</h2>
      <p>Wallet: {address}</p>
      <button onClick={fetchTransfers} disabled={loading}>
        {loading ? 'Fetching...' : 'Analyze Wallet'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>ERC20 Transfers</h3>
      <ul>
        {erc20Transfers.length === 0 && <li>No transfers found.</li>}
        {erc20Transfers.map((t, i) => (
          <li key={i}>
            {t.from} → {t.to} : {t.value} {t.tokenSymbol} (Block {t.blockNum})
          </li>
        ))}
      </ul>
    </div>
  );
}
