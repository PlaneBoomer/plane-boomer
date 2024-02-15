import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  const nonce = Math.random().toString(36).substring(2, 15);
  return NextResponse.json({ nonce });
}