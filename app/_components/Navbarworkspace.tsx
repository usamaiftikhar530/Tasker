"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import InviteCard from "@/app/_components/Invitecard";

import Logo from "@/components/logo";
import hamburger from "@/public/icons/hamburger.png";
import userIcon from "@/public/icons/userIcon.png";
import notifyIcon from "@/public/icons/notifyIcon.png";

import { SidebarOpenClose } from "@/redux/features/sidebar-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { setWorkspaces } from "@/redux/features/workspaceslice";

function Navbarworkspace() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [userIconScreen, setUserIconScreen] = useState(false);
  const [notifyPopup, setNotifyPopup] = useState(false);
  const [allInviteNotifications, setAllInviteNotification] = useState([]);
  const [notifyDot, setNotifyDot] = useState(true);

  const workspaces = useSelector((state: any) => state.workspace.workspaces);

  useEffect(() => {
    inviteNotifications();
  }, []);

  const inviteNotifications = async () => {
    console.log("Invite Client Call");

    const response = await fetch("/api/member/invite", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    if (res) {
      setAllInviteNotification(res);
    }
  };

  const onClickHamburger = () => {
    dispatch(SidebarOpenClose());
  };

  const onClickUserIcon = () => {
    setUserIconScreen(!userIconScreen);
  };

  const onClickLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
      if (response.status == 202) {
        toast.success("Logout Successfuly", {
          autoClose: 3000,
        });
        router.push("/");
      } else {
        toast.error("Failed to Logout!", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Failed to Logout!", {
        autoClose: 3000,
      });
    }
  };

  const onClickJoin = async (inviteData: any) => {
    const response = await fetch("/api/member/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inviteData }),
    });
    const res = await response.json();
    if (res) {
      dispatch(setWorkspaces([...workspaces, res]));
      toast.success("Workspace Joined Successfuly", {
        autoClose: 3000,
      });

      const filteredInvite = allInviteNotifications.filter(
        (item: any) => item.invite_id !== inviteData.invite_id
      );
      setAllInviteNotification(filteredInvite);
      setNotifyDot(false);
    }
  };

  const onClickReject = async (inviteData: any) => {
    setNotifyDot(false);
  };

  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center justify-between">
      <div className="md:max-w-screen-2xl mx-auto items-center w-full justify-between md:flex hidden">
        <Logo workspaceID={workspaces[0]?.workspace_id} />
      </div>
      <div className="flex md:hidden" onClick={onClickHamburger}>
        <Image src={hamburger} alt="HamburgerIcon" width={35} height={35} />
      </div>
      <div className="flex items-center gap-3">
        <div
          onClick={() => setNotifyPopup(!notifyPopup)}
          className="relative hover:cursor-pointer"
        >
          {notifyDot && !notifyPopup && allInviteNotifications.length > 0 && (
            <div className="absolute w-3 h-3 bg-red-600 rounded-full right-0 top-0"></div>
          )}
          <Image
            src={notifyIcon}
            alt="Notification Icon"
            width={25}
            height={25}
          />

          {/* Notification Popup */}
          {notifyPopup && (
            <div className="z-40 absolute overflow-y-auto w-44 min-h-48 max-h-48 top-10 right-0 px-1 py-1 border shadow-lg bg-slate-100">
              {allInviteNotifications.map((item, index) => {
                return (
                  <InviteCard
                    key={index}
                    inviteNotification={item}
                    onClickJoinFunc={onClickJoin}
                    onClickRejectFunc={onClickReject}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="relative">
          <Image
            onClick={onClickUserIcon}
            src={userIcon}
            alt="user profile"
            width={35}
            height={35}
          />
          <div className={userIconScreen ? "block" : "hidden"}>
            <div className="absolute rounded-md bg-slate-100 top-10 right-1 mx-auto items-center justify-between border-l-2">
              <button
                onClick={onClickLogout}
                className="bg-blue-500 mx-5 my-5 w-20 rounded-md text-white font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbarworkspace;
