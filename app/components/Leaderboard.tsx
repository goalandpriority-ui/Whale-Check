"use client";

export default function Leaderboard() {
  return (
    <div style={{ marginTop: "30px", width: "100%", maxWidth: "400px" }}>
      <h3 style={{ marginBottom: "10px" }}>🐋 Base Whale Leaderboard</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li
          style={{
            padding: "12px",
            border: "1px solid #eee",
            borderRadius: "10px",
            marginBottom: "10px",
            fontSize: "14px",
          }}
        >
          <b>#1</b> 0x4e83362442B8d1beC281594cEa3050c8EB01311C
          <br />
          💰 1000+ ETH (Base)
        </li>
      </ul>

      <p style={{ fontSize: "12px", opacity: 0.6 }}>
        More features coming soon 🚀
      </p>
    </div>
  );
}
