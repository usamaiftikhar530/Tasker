import { getDataFromToken } from "@/app/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
  const userID = await getDataFromToken(request);
  if (userID) {
    //Find if user Exists in Database
    const result = await sql.query(
      "SELECT * FROM usertrello u JOIN workspace w ON u.user_id = workspace_owner_id WHERE user_id = $1",
      [userID]
    );
    const user = result.rows[0];
    return NextResponse.json(user);
  } else {
    return NextResponse.json({ Error: "Could not Get User Data" });
  }
}
