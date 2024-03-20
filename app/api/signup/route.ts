import { NextRequest, NextResponse } from "next/server";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstname, lastname, email, password } = body;

  //Find if user already Exist
  const result = await sql.query(
    "SELECT * FROM usertrello WHERE user_email = $1",
    [email]
  );
  const user = result.rows[0];

  if (user) {
    return NextResponse.json(
      { message: "User Already Exist" },
      { status: 409 }
    );
  }

  const newUserResult = await sql.query(
    "INSERT INTO usertrello (user_email, user_password, user_name_first,user_name_last) VALUES($1, $2, $3, $4) RETURNING *",
    [email, password, firstname, lastname]
  );

  const newUser = newUserResult.rows[0];

  // Creating Default Workspace
  const workspaceOwnerId = newUser.user_id;
  const workspace = await sql.query(
    "INSERT INTO workspace (workspace_name, workspace_owner_id) VALUES($1, $2) RETURNING *",
    [firstname, workspaceOwnerId]
  );
  const newWorkspace = workspace.rows[0];

  const newWorkspaceID = newWorkspace.workspace_id;
  const today = new Date();
  const workspaceMember = await sql.query(
    "INSERT INTO workspacemember (member_user, member_workspace, member_role, member_joined_date) VALUES($1, $2, $3, $4)",
    [workspaceOwnerId, newWorkspaceID, "Admin", today]
  );

  console.log(newUser);
  if (newUser) {
    return NextResponse.json(
      { message: "New user Created Successfuly" },
      { status: 201 }
    );
  } else {
    return NextResponse.json(
      { message: "Failed to create new user" },
      { status: 401 }
    );
  }
}
