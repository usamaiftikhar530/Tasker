import { NextRequest, NextResponse } from "next/server";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";

export async function POST(req: NextRequest) {
  try {
    const { inviteData } = await req.json();

    const memberUserID = inviteData.invite_to;
    const memberWorkspaceID = inviteData.invite_workspace;
    const memberRole = inviteData.invite_user_role;
    const todayDate = new Date();

    const memberWorkspaceAlready = await sql.query(
      "SELECT COUNT(*) FROM workspacemember WHERE member_user = $1 AND member_workspace = $2",
      [memberUserID, memberWorkspaceID]
    );

    if (memberWorkspaceAlready.rows[0].count > 0) {
      return NextResponse.json({ message: "Already Exits" }, { status: 409 });
    }

    const memberWorkspace = await sql.query(
      "INSERT INTO workspacemember (member_user, member_workspace, member_role, member_joined_date) VALUES($1, $2, $3, $4) RETURNING *",
      [memberUserID, memberWorkspaceID, memberRole, todayDate]
    );

    await sql.query(
      "UPDATE inviteuser SET invite_accepted = true WHERE invite_to = $1 AND invite_workspace = $2",
      [memberUserID, memberWorkspaceID]
    );

    const addWorkspace = await sql.query(
      "SELECT * FROM workspace WHERE workspace_id = $1",
      [memberWorkspaceID]
    );
    const addWorkspaceResult = addWorkspace.rows[0];
    return NextResponse.json(addWorkspaceResult, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to Join" }, { status: 401 });
  }
}
