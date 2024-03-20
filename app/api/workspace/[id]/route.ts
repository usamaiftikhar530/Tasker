import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";

export async function GET(req: NextRequest) {
  try {
    const { workspaceid } = Object.fromEntries(req.nextUrl.searchParams);

    const boards = await sql.query(
      "SELECT * FROM board WHERE board_workspace_id = $1",
      [workspaceid]
    );

    const allBoards = boards.rows;

    if (allBoards) {
      return NextResponse.json(allBoards, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Failed To get Boards" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed To get Boards" },
      { status: 404 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { newBoardName, workspaceId } = body;

    const board = await sql.query(
      "INSERT INTO board (board_name, board_workspace_id) VALUES($1, $2) RETURNING *",
      [newBoardName, workspaceId]
    );
    const newBoard = board.rows[0];
    if (newBoard) {
      return NextResponse.json(newBoard, { status: 201 });
    } else {
      return NextResponse.json(
        { message: "Failed to create new Board" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create new Board" },
      { status: 401 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { workspaceID } = await req.json();

    const userID = await getDataFromToken(req);
    if (userID) {
      const owner = await sql.query(
        "SELECT COUNT(*) FROM workspace WHERE workspace_owner_id = $1 AND workspace_id = $2",
        [userID, workspaceID]
      );

      if (owner.rows[0].count <= 0) {
        return NextResponse.json(
          { message: "Only Owner can Delete" },
          { status: 409 }
        );
      }

      const result = await sql.query(
        "DELETE FROM workspace WHERE workspace_id = $1",
        [workspaceID]
      );

      if (result.rowCount > 0) {
        return NextResponse.json(
          { message: "List Deleted Successfuly" },
          { status: 200 }
        );
      } else {
        console.log("No Workspace Found");

        return NextResponse.json(
          { message: "No Workspace Found" },
          { status: 405 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to Delete Workspace" },
      { status: 405 }
    );
  }
}
