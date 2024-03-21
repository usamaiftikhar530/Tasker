import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";
import jwt from "jsonwebtoken";
const compare = require("bcrypt");

export async function POST(req: Request, res: NextResponse) {
  try {
    const body = await req.json();
    const { email, password } = body;

    //Find if user already Exist
    const result = await sql.query(
      "SELECT * FROM usertrello WHERE user_email = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Getting Workspace
    const ownerID = user.user_id;
    const workspace = await sql.query(
      "SELECT * FROM workspace WHERE workspace_owner_id = $1",
      [ownerID]
    );
    const workspaceResult = workspace.rows[0];

    // Create JWT Token
    const tokenData = {
      id: user.user_id,
      email: user.user_email,
    };

    const jwtSecret = process.env.JWT_SECRET || "";
    const token = jwt.sign(tokenData, jwtSecret, {
      expiresIn: "1h",
    });

    const response = NextResponse.json(
      {
        workspaceResult,
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;

    // return NextResponse.json(token);
  } catch (err: any) {
    console.error(err.message);
  }
}
