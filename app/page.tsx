"use client";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #020617, #020617)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#020617",
          border: "1px solid #1e293b",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h1 style={{ fontSize: "26px", marginBottom: "6px" }}>
          🐳 Whale Check
        </h1>

        <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
          Check if a wallet is a whale
        </p>

        <input
          placeholder="Enter wallet address"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #334155",
            background: "#020617",
            color: "white",
            marginBottom: "14px",
          }}
        />

        <button
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Check Whale
        </button>

        <div
          style={{
            marginTop: "18px",
            padding: "12px",
            borderRadius: "10px",
            background: "#020617",
            border: "1px dashed #334155",
            textAlign: "center",
            color: "#94a3b8",
          }}
        >
          Result will appear here
        </div>
      </div>
    </main>
  );
}
