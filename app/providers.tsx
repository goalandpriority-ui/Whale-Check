'use client';

import { WagmiConfig, createClient } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains: [base],
    }),
  ],
});

const queryClient = new QueryClient();

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfig client={wagmiClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}
