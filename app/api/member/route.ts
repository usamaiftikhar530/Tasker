import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(req: NextRequest) {
  const { workspaceid } = Object.fromEntries(req.nextUrl.searchParams);
  return NextResponse.json("Workspace ID " + workspaceid, { status: 200 });
}
