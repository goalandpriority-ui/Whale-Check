"use client"

import { useState, useEffect } from "react"
import { sdk } from "@farcaster/miniapp-sdk"
import { useAccount, useConnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { writeContract, readContract, getBalance } from "@wagmi/core"
import { parseUnits, formatUnits } from "viem"

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
const USDC_DECIMALS = 6

const TOKENS = [
  // Add extra tokens here if wanted
  // Example placeholder (replace with real Base tokens)
  // { name: "USDT", address: "0x...", decimals: 6, price: 1 },
  // { name: "DAI", address: "0x...", decimals: 18, price: 1 }
]

const receiveAddress = "0xYOUR_WALLET_ADDRESS_HERE" // Replace with your Base wallet address to receive payments

const rankData: Record<string, { title: string; message: string; image: string }> = {
  SHRIMP: { title: "🐟 SHRIMP", message: "Everyone starts somewhere da 😅", image: "/shrimp.png" },
  DOLPHIN: { title: "🐬 DOLPHIN", message: "Warming up for whale status 🐬", image: "/dolphin.png" },
  WHALE: { title: "🐳 WHALE", message: "Respect 🫡 Base Whale detected", image: "/whale.png" },
  MEGA: { title: "👑 MEGA WHALE", message: "BASE ROYALTY 👑", image: "/mega.png" }
}

const rankPriority: Record<string, number> = {
  MEGA: 4,
  WHALE: 3,
  DOLPHIN: 2,
  SHRIMP: 1
}

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()

  const [showResult, setShowResult] = useState(false)
  const [finalRank, setFinalRank] = useState<"SHRIMP" | "DOLPHIN" | "WHALE" | "MEGA">("SHRIMP")
  const [leaderboard, setLeaderboard] = useState<Array<{ address: string; rank: string }>>([])

  useEffect(() => {
    sdk.actions.ready()
    loadLeaderboard()
  }, [])

  // Wallet connect → fetch leaderboard from localStorage
  const loadLeaderboard = () => {
    const data = localStorage.getItem("leaderboard")
    if (data) {
      const arr = JSON.parse(data)
      arr.sort((a: any, b: any) => rankPriority[b.rank] - rankPriority[a.rank])
      setLeaderboard(arr)
    }
  }

  // Whale rank calc based on total USD
  const getWhaleRank = (usd: number) => {
    if (usd < 500) return "SHRIMP"
    if (usd < 5000) return "DOLPHIN"
    if (usd < 50000) return "WHALE"
    return "MEGA"
  }

  // Fetch USDC balance
  const getUSDCBalance = async (addr: `0x${string}`) => {
    const balance = await readContract({
      address: USDC_ADDRESS,
      abi: [
        {
          name: "balanceOf",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "owner", type: "address" }],
          outputs: [{ name: "balance", type: "uint256" }]
        }
      ],
      functionName: "balanceOf",
      args: [addr]
    })

    return Number(formatUnits(balance as bigint, USDC_DECIMALS))
  }

  // Fetch ETH balance (fixed price for demo)
  const getETHBalanceUSD = async (addr: `0x${string}`) => {
    const balance = await getBalance({ address: addr })
    const ethAmount = Number(balance.formatted)
    const ETH_PRICE = 3000
    return ethAmount * ETH_PRICE
  }

  // Fetch token balances
  const getTokenUSD = async (token: any, addr: `0x${string}`) => {
    const balance = await readContract({
      address: token.address,
      abi: [
        {
          name: "balanceOf",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "owner", type: "address" }],
          outputs: [{ name: "balance", type: "uint256" }]
        }
      ],
      functionName: "balanceOf",
      args: [addr]
    })

    const amount = Number(formatUnits(balance as bigint, token.decimals))
    return amount * token.price
  }

  // Total USD balance calc
  const getTotalUSD = async (addr: `0x${string}`) => {
    let total = 0
    total += await getETHBalanceUSD(addr)
    total += await getUSDCBalance(addr)
    for (const token of TOKENS) {
      total += await getTokenUSD(token, addr)
    }
    return total
  }

  // Save leaderboard
  const saveRank = (addr: string, rank: string) => {
    const data = localStorage.getItem("leaderboard")
    let arr = data ? JSON.parse(data) : []
    const idx = arr.findIndex((i: any) => i.address === addr)
    if (idx !== -1) {
      arr[idx].rank = rank
    } else {
      arr.push({ address: addr, rank })
    }
    arr.sort((a: any, b: any) => rankPriority[b.rank] - rankPriority[a.rank])
    localStorage.setItem("leaderboard", JSON.stringify(arr))
    setLeaderboard(arr)
  }

  // Payment function
  const payUSDC = async () => {
    if (!address) {
      alert("Connect your wallet da!")
      return
    }

    try {
      await writeContract({
        address: USDC_ADDRESS,
        abi: [
          {
            name: "transfer",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "to", type: "address" },
              { name: "amount", type: "uint256" }
            ],
            outputs: [{ name: "", type: "bool" }]
          }
        ],
        functionName: "transfer",
        args: ["0x8C4BB608034fE666FeE1eE9a3a3bcB5F28A9a187", parseUnits("0.05", USDC_DECIMALS)]
      })

      const totalUSD = await getTotalUSD(address as `0x${string}`)
      const rank = getWhaleRank(totalUSD)
      setFinalRank(rank)
      saveRank(address, rank)
      setShowResult(true)
    } catch {
      alert("Payment failed da machi 😅")
    }
  }

  // Share rank cast
  const shareRank = async (rank: string) => {
    await sdk.actions.composeCast({
      text: `I just checked my Whale Rank on Base 🐳\nResult: ${rank}\n\nCheck yours 👇`,
      embeds: [{ url: window.location.href }]
    })
  }

  const data = rankData[finalRank]

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #020617, #020617)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 20
      }}
    >
      {!isConnected ? (
        <button
          onClick={() => connect({ connector: injected() })}
          style={{
            width: "100%",
            maxWidth: 420,
            padding: 14,
            fontSize: 16,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "#16a34a",
            color: "white",
            fontWeight: "bold",
            marginBottom: 20
          }}
        >
          Connect Wallet 🔌
        </button>
      ) : !showResult ? (
        <button
          onClick={payUSDC}
          style={{
            width: "100%",
            maxWidth: 420,
            padding: 14,
            fontSize: 16,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            marginBottom: 10
          }}
        >
          Pay $0.05 USDC & Unlock 🐳
        </button>
      ) : (
        <div
          style={{
            maxWidth: 420,
            width: "100%",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 24,
            background: "#020617",
            textAlign: "center"
          }}
        >
          <h2 style={{ fontSize: 26, marginBottom: 12 }}>{data.title}</h2>
          <img
            src={data.image}
            alt={finalRank}
            style={{ width: "100%", borderRadius: 12, marginBottom: 16 }}
          />
          <p style={{ fontSize: 16, marginBottom: 20, opacity: 0.9 }}>{data.message}</p>
          <button
            onClick={() => shareRank(data.title)}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 15,
              borderRadius: 12,
              border: "1px solid #2563eb",
              background: "transparent",
              color: "#60a5fa",
              cursor: "pointer",
              marginBottom: 10
            }}
          >
            Share My Rank 🔁
          </button>
          <p style={{ fontSize: 12, opacity: 0.5 }}>Whale Rank • Base Chain</p>
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <section style={{ marginTop: 40, width: "100%", maxWidth: 420 }}>
          <h3 style={{ textAlign: "center", marginBottom: 10 }}>🏆 Leaderboard</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {leaderboard.slice(0, 10).map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                  fontSize: 14,
                  color: "#60a5fa"
                }}
              >
                <span>
                  {item.address.slice(0, 6)}
                  ...
                  {item.address.slice(-4)}
                </span>
                <span>{item.rank}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
  }
