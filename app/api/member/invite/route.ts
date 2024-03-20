import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";
// const pool = require("@/db");
import { sql } from "@vercel/postgres";

export async function GET(req: NextRequest) {
  try {
    const userID = await getDataFromToken(req);
    if (userID) {
      const notifyData = await sql.query(
        `
        SELECT 
            i.*,
            invite_by_user.user_name_first AS invite_by_username, 
            invite_to_user.user_name_first AS invite_to_username, 
            w.workspace_name AS workspace_name
        FROM 
            inviteuser i
        JOIN
            usertrello invite_by_user ON i.invite_by = invite_by_user.user_id
        JOIN
            usertrello invite_to_user ON i.invite_to = invite_to_user.user_id
        JOIN
            workspace w ON i.invite_workspace = w.workspace_id
        WHERE 
            i.invite_to = $1 AND i.invite_accepted = false
      `,
        [userID]
      );

      const allNotifyData = notifyData.rows;
      if (allNotifyData) {
        return NextResponse.json(allNotifyData, { status: 200 });
      } else {
        return NextResponse.json(
          { message: "No Invitaion Found" },
          { status: 404 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Failed To get Invitations" },
      { status: 404 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { inviteUserEmail, inviteUserRole, workspaceID } = await req.json();

    const userEmail = await sql.query(
      "SELECT * FROM usertrello WHERE user_email = $1",
      [inviteUserEmail]
    );

    const userFound = userEmail.rows[0];
    if (!userFound) {
      return NextResponse.json(
        { message: "Failed To Find User Email" },
        { status: 404 }
      );
    }

    const userID = await getDataFromToken(req);
    if (userID) {
      const sendUserID = userID;
      const recieverUserID = userFound.user_id;

      // Check if Already Invited
      const alreadyInvited = await sql.query(
        "SELECT COUNT(*) FROM inviteuser WHERE invite_to = $1 AND invite_workspace = $2",
        [recieverUserID, workspaceID]
      );

      if (alreadyInvited.rows[0].count > 0) {
        return NextResponse.json({ message: "Already Exits" }, { status: 409 });
      }

      // Insert New Invite
      const invitation = await sql.query(
        "INSERT INTO inviteuser (invite_by, invite_to, invite_workspace, invite_accepted, invite_user_role) VALUES($1, $2, $3, $4, $5) RETURNING *",
        [sendUserID, recieverUserID, workspaceID, false, inviteUserRole]
      );

      const invitationResults = invitation.rows[0];
      console.log(invitationResults);

      return NextResponse.json(invitationResults, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Failed to Invite" }, { status: 401 });
  }
}
