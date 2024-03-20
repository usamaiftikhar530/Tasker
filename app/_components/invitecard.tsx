import React, { useEffect } from "react";

interface InviteNotification {
  invite_id: number;
  invite_by_username: string;
  workspace_name: string;
}

function invitecard({
  inviteNotification,
  onClickJoinFunc,
  onClickRejectFunc,
}: {
  inviteNotification: InviteNotification;
  onClickJoinFunc: (inviteID: InviteNotification) => void;
  onClickRejectFunc: (inviteID: InviteNotification) => void;
}) {
  return (
    <div className="p-1 shadow-md bg-white rounded-md mb-2">
      <p className="text-sm">
        <span className="font-semibold">
          {inviteNotification.invite_by_username}
        </span>{" "}
        Invited you to join{" "}
        <span className="font-semibold">
          {inviteNotification.workspace_name}
        </span>
      </p>
      <div className="flex gap-2 items-center justify-center mt-2">
        <button
          onClick={() => onClickJoinFunc(inviteNotification)}
          className="bg-green-500 px-2 rounded-sm text-white font-semibold"
        >
          Join
        </button>
        <button
          onClick={() => onClickRejectFunc(inviteNotification)}
          className="bg-red-500 px-2 rounded-sm text-white font-semibold"
        >
          Reject
        </button>
      </div>
    </div>
  );
}

export default invitecard;
