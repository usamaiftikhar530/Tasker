import { NextRequest, NextResponse } from "next/server";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";

export async function PUT(req: NextRequest) {
  try {
    const { items } = await req.json();

    // Start a PostgreSQL transaction
    await pool.query("BEGIN");

    // Iterate over newListOrders and update each list_order value
    for (const { list_id, list_order } of items) {
      await sql.query("UPDATE list SET list_order = $1 WHERE list_id = $2", [
        list_order,
        list_id,
      ]);
    }

    // Commit the transaction if all updates succeed
    await pool.query("COMMIT");

    return NextResponse.json(
      { message: "List Order Updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed To Update List Order" },
      { status: 405 }
    );
  }
}
