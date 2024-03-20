import { NextRequest, NextResponse } from "next/server";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";

export async function POST(req: NextRequest) {
  try {
    const { cardDescrption, cardOrder, listId } = await req.json();

    const card = await sql.query(
      "INSERT INTO card (card_description, card_order, card_list_id) VALUES($1, $2, $3) RETURNING *",
      [cardDescrption, cardOrder, listId]
    );

    const newCard = card.rows[0];
    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create new Card" },
      { status: 401 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { cardDesc, selectedCardID } = await req.json();
    console.log(cardDesc, selectedCardID);

    const result = await sql.query(
      "UPDATE card SET card_description = $1 WHERE card_id = $2 RETURNING *",
      [cardDesc, selectedCardID]
    );

    if (result.rowCount === 1) {
      return NextResponse.json(
        { message: "Card Updated Successfuly" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Card Not Found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed To Update Card" },
      { status: 405 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { selectedCardID } = await req.json();

    const result = await sql.query("DELETE FROM card WHERE card_id = $1", [
      selectedCardID,
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
