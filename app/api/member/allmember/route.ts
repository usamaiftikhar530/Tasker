import { NextRequest, NextResponse } from "next/server";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";

export async function GET(req: NextRequest) {
  try {
    const { workspaceid } = Object.fromEntries(req.nextUrl.searchParams);

    if (!workspaceid) {
      throw "Failed to Get Members";
    }

    const members = await sql.query(
      "SELECT w.*,u.user_name_first AS user_name FROM workspacemember w JOIN usertrello u ON w.member_user = u.user_id WHERE member_workspace = $1",
      [workspaceid]
    );

    const membersResult = members.rows;
    if (membersResult) {
      return NextResponse.json(membersResult, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "No Members Found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed To get Members" },
      { status: 404 }
    );
  }
}
