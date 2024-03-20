import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";

export async function POST(req: NextRequest) {
  try {
    const { workspaceID } = await req.json();
    const userID = await getDataFromToken(req);
    if (userID) {
      const owner = await sql.query(
        "SELECT COUNT(*) FROM workspace WHERE workspace_owner_id = $1 AND workspace_id = $2",
        [userID, workspaceID]
      );

      if (owner.rows[0].count > 0) {
        return NextResponse.json(
          { message: "Ower cannot leave" },
          { status: 409 }
        );
      }

      const result = await sql.query(
        "DELETE FROM workspacemember WHERE member_user = $1 AND member_workspace = $2",
        [userID, workspaceID]
      );

      if (result.rowCount > 0) {
        return NextResponse.json(
          { message: "Memeber Leave Successfuly" },
          { status: 200 }
        );
      } else {
        console.log("No Member Found");

        return NextResponse.json(
          { message: "No Member Found" },
          { status: 405 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json({ message: "No Member Found" }, { status: 405 });
  }
}
