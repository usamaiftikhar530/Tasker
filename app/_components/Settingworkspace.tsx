"use client";

import React, { useEffect, useState } from "react";
import { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import MemberWorkspace from "@/app/_components/Memberworkspace";
import { useSelector } from "react-redux";

import profileIcon from "@/public/icons/userIcon.png";

export default function Settingworkspace({
  workspaceID,
}: {
  workspaceID: number;
}) {
  const router = useRouter();
  const [inviteUserEmail, setInviteUserEmail] = useState("");
  const [inviteUserRole, setInviteUserRole] = useState("Admin");
  const [members, setMembers] = useState([]);

  const workspaces = useSelector((state: any) => state.workspace.workspaces);

  useEffect(() => {
    if (workspaceID !== 0) {
      // getMembers();
    }
  });

  const getMembers = async () => {
    console.log("Get Members Client side log");

    const response = await fetch(
      // "/api/member/workspace?workspaceid=" + workspaceID,
      "/api/member/allmember",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const res = await response.json();
    if (response.status == 200) {
      console.log(res);

      setMembers(res);
    } else {
      console.log(response.status);
    }
  };

  const onClickInvite = async () => {
    const response = await fetch("/api/member/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inviteUserEmail, inviteUserRole, workspaceID }),
    });

    const res = await response.json();

    if (response.status == 404) {
      toast.warning("Enter Valid Email", {
        autoClose: 3000,
      });
    } else if (response.status == 409) {
      toast.warning("Already Invited", {
        autoClose: 3000,
      });
    } else if (response.status == 201) {
      toast.success("Invite Sent", {
        autoClose: 3000,
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInviteUserEmail(value);
  };

  const handleDropDownChange = (e: any) => {
    const { value } = e.target;
    setInviteUserRole(value);
  };

  const onClickLeaveWorkspace = async () => {
    const response = await fetch("/api/member/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workspaceID }),
    });

    // const res = await response.json();

    if (response.status == 200) {
      toast.success("Member Left Successfuly", {
        autoClose: 3000,
      });

      const otherWorkace = workspaces.find(
        (item: any) => item.workspace_id !== workspaceID
      );

      if (otherWorkace) {
        router.push("/workspace/" + otherWorkace.workspace_id);
      } else {
        router.push("/");
      }
    } else if (response.status == 409) {
      toast.warning("Owner Cannot Leave", {
        autoClose: 3000,
      });
    } else {
      toast.error("Failed to Leave", {
        autoClose: 3000,
      });
    }
  };

  const onClickDeleteWorkspace = async () => {
    const response = await fetch("/api/workspace/" + workspaceID, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workspaceID }),
    });

    // const res = await response.json();

    if (response.status == 200) {
      toast.success("Workspace Deleted", {
        autoClose: 3000,
      });

      const otherWorkace = workspaces.find(
        (item: any) => item.workspace_id !== workspaceID
      );

      if (otherWorkace) {
        router.push("/workspace/" + otherWorkace.workspace_id);
      } else {
        router.push("/");
      }
    } else if (response.status == 409) {
      toast.warning("Only Onwer can Delete", {
        autoClose: 3000,
      });
    } else {
      toast.error("Failed to Delete", {
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="">
      <button onClick={getMembers}>Get All Members</button>
      <h1 className="font-bold text-4xl">Settings</h1>
      <p className="text-slate-500 font-semibold my-2">
        Manage Workspace Setting
      </p>
      <div className="my-6 flex flex-col gap-2">
        <p className="font-bold text-slate-800">Danger</p>
        <div className="flex gap-2">
          <button
            onClick={onClickLeaveWorkspace}
            className="shadow-sm border border-red-200 px-4 py-1 rounded-md text-red-500 font-semibold"
          >
            Leave Workspace
          </button>
          <button
            onClick={onClickDeleteWorkspace}
            className="shadow-sm border border-red-200 px-4 py-1 rounded-md text-red-500 font-semibold"
          >
            Delete Workspace
          </button>
        </div>
      </div>

      {/* Invite New Member */}
      <div className="my-5">
        <p className="font-bold text-slate-800 bg-slate-300 rounded-sm px-2 py-1 inline-block">
          Invite New Member
        </p>
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full divide-y divide-gray-200 border">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap sm:px-3">
                  <input
                    className="bg-slate-100 rounded-md outline-none px-2 py-2"
                    placeholder="Enter email to Invite"
                    type="email"
                    name=""
                    id=""
                    onChange={handleChange}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap sm:px-3">
                  <select
                    onChange={handleDropDownChange}
                    className="block bg-white border rounded-md px-3 py-2"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap sm:px-3">
                  <button
                    onClick={onClickInvite}
                    className="bg-blue-950 text-white px-4 py-1 rounded-md font-semibold"
                  >
                    Invite
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* All Workspace Members */}
      <div className="">
        <p className="font-bold text-slate-800 bg-slate-300 rounded-sm px-2 py-1 inline-block">
          Members
        </p>
        <div className="overflow-x-auto mt-5">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Joined Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
              </tr>
            </thead>
            {/* {members &&
              members?.map((item, index) => {
                console.log("Member Item in Loop " + item);

                return <MemberWorkspace key={index} member={item} />;
              })} */}
          </table>
        </div>
      </div>
    </div>
  );
}
