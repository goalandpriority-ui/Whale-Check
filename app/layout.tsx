import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Whale Check",
  description: "Wallet Whale Checker",
};

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
