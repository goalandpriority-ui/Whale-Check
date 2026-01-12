import "./globals.css";

export const metadata = {
  title: "Whale Check",
  description: "Check if an address is a whale 🐳",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
