import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(req: NextRequest) {
  console.log("Member New Route Called");
  return NextResponse.json("Succ", { status: 200 });
}
