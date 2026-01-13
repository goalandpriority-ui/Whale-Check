import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.BASESCAN_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key missing" }, { status: 500 });
  }

  const url =
    "https://api.basescan.org/api?module=account&action=balancemulti&address=" +
    [
      "0x4833624428d1beC281594cEa3050c8EB01311C",
      "0x28C6c06298d514Db089934071355E5743bf21d60"
    ].join(",") +
    `&tag=latest&apikey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}
