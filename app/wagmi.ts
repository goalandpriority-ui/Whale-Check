import { http, createConfig } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});
