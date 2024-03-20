import { NextRequest, NextResponse } from "next/server";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    const userID = await getDataFromToken(request);
    if (userID) {
      const result = await sql.query(
        "SELECT * FROM workspace w LEFT JOIN workspacemember wm ON w.workspace_id = wm.member_workspace WHERE w.workspace_owner_id = $1 OR wm.member_user = $1",
        [userID]
      );
      const workspaces = result.rows;

      if (workspaces) {
        return NextResponse.json(workspaces, { status: 200 });
      }
    } else {
      return NextResponse.json(
        { message: "Failed To get Workspaces" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed To get Workspaces" },
      { status: 404 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const workspaceName = body;
    const userID = await getDataFromToken(request);
    if (userID) {
      const workspaceOwnerId = userID;

      // Find if Workspace with this name is already Created
      const hasWorkspace = await sql.query(
        "SELECT * FROM workspace WHERE workspace_name = $1",
        [workspaceName]
      );

      if (hasWorkspace.rows[0]) {
        return NextResponse.json(
          { message: "Workspace Already Exist" },
          { status: 409 }
        );
      }

      const workspace = await sql.query(
        "INSERT INTO workspace (workspace_name, workspace_owner_id) VALUES($1, $2) RETURNING *",
        [workspaceName, workspaceOwnerId]
      );
      const newWorkspace = workspace.rows[0];

      const newWorkspaceID = newWorkspace.workspace_id;
      const today = new Date();
      const workspaceMember = await sql.query(
        "INSERT INTO workspacemember (member_user, member_workspace, member_role, member_joined_date) VALUES($1, $2, $3, $4)",
        [workspaceOwnerId, newWorkspaceID, "Admin", today]
      );

      return NextResponse.json(newWorkspace, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create new Workspaces" },
      { status: 401 }
    );
  }
}
