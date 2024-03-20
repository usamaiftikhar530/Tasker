import { NextRequest, NextResponse } from "next/server";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";

export async function PUT(req: NextRequest) {
  try {
    const { newOrderedLists } = await req.json();

    await pool.query("BEGIN");

    for (let index = 0; index < newOrderedLists.length; index++) {
      const element = newOrderedLists[index].cards;

      for (const { card_id, card_order, card_list_id } of element) {
        await sql.query(
          "UPDATE card SET card_order = $1, card_list_id = $2 WHERE card_id = $3",
          [card_order, card_list_id, card_id]
        );
      }
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
