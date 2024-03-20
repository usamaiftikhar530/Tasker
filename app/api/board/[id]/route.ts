import { NextRequest, NextResponse } from "next/server";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";

export async function GET(req: NextRequest) {
  try {
    const { boardid } = Object.fromEntries(req.nextUrl.searchParams);
    const boardId = boardid;

    const result = await sql.query(
      `
      SELECT 
          l.list_id,
          l.list_title,
          l.list_order,
          json_agg(c) AS cards
      FROM 
          list l
      LEFT JOIN
          card c ON l.list_id = c.card_list_id
      WHERE 
          l.list_board_id = $1
      GROUP BY
          l.list_id
      ORDER BY
          l.list_order ASC;
    `,
      [boardId]
    );

    const listsResult = result.rows;

    if (listsResult) {
      return NextResponse.json(listsResult, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed To get Lists" },
      { status: 404 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { listName, listOrder } = await req.json();
    const { boardid } = Object.fromEntries(req.nextUrl.searchParams);

    const title = listName;
    const order = listOrder;
    const boardId = boardid;

    const list = await sql.query(
      "INSERT INTO list (list_title, list_order, list_board_id) VALUES($1, $2, $3) RETURNING *",
      [title, order, boardId]
    );

    const newList = list.rows[0];
    console.log(newList);

    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create new List" },
      { status: 401 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { listId } = await req.json();

    const result = await sql.query("DELETE FROM list WHERE list_id = $1", [
      listId,
    ]);

    if (result.rowCount > 0) {
      return NextResponse.json(
        { message: "List Deleted Successfuly" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to Delete List" },
      { status: 405 }
    );
  }
}
