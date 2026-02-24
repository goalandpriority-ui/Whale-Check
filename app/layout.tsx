import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Base Whale Checker",
  description: "Check if a wallet is a whale on Base chain",
};

// 🚨 Disable SSR for Providers
const Providers = dynamic(() => import("./providers"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
