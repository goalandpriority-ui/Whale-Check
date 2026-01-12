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
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          backgroundColor: "#0b1220",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
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

        {/* Page Content */}
        <main
          style={{
            minHeight: "calc(100vh - 60px)",
            padding: "24px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
