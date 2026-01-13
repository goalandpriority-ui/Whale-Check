export default function Leaderboard() {
  const data = [
    { rank: 1, address: "0xA1...23F", balance: "120 ETH" },
    { rank: 2, address: "0xB4...98C", balance: "95 ETH" },
    { rank: 3, address: "0xC9...11A", balance: "80 ETH" },
  ];

  return (
    <div style={{ marginTop: 40, width: "100%", maxWidth: 420 }}>
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>
        🐋 Whale Leaderboard
      </h2>

      {data.map((item) => (
        <div
          key={item.rank}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 16px",
            marginBottom: 10,
            borderRadius: 10,
            background: "#f5f5f5",
          }}
        >
          <span>#{item.rank}</span>
          <span>{item.address}</span>
          <strong>{item.balance}</strong>
        </div>
      ))}
    </div>
  );
}
