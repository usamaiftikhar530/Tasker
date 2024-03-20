import { NextRequest, NextResponse } from "next/server";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";

export async function PUT(req: NextRequest) {
  try {
    const { reorderedCards } = await req.json();

    await pool.query("BEGIN");

    for (const { card_id, card_order } of reorderedCards) {
      await sql.query("UPDATE card SET card_order = $1 WHERE card_id = $2", [
        card_order,
        card_id,
      ]);
    }

    await pool.query("COMMIT");

    return NextResponse.json(
      { message: "Card Order Updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed To Update Card Order" },
      { status: 405 }
    );
  }
}
