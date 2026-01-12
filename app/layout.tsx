import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Whale Check",
  description: "Base Whale Check App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header
            style={{
              padding: "16px",
              fontSize: "20px",
              fontWeight: "bold",
              borderBottom: "1px solid #1f2937",
            }}
          >
            🐳 Whale Check
          </header>

          <main style={{ padding: "24px" }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
