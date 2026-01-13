import WalletStatus from "./components/WalletStatus";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px" }}>🐋 Whale Check</h1>

      <p style={{ fontSize: "14px", color: "#555" }}>
        Connect your wallet to begin
      </p>

      <WalletStatus />

      <div
        style={{
          marginTop: "24px",
          fontSize: "12px",
          color: "#888",
        }}
      >
        More features coming soon 🚀
      </div>
    </main>
  );
}
