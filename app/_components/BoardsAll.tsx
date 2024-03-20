"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import workspaceLogo from "@/public/icons/workspaceLogo.png";
import membershipIcon from "@/public/icons/membershipIcon.png";
import userIcon from "@/public/icons/userIcon2.png";
import cancelIcon from "@/public/icons/cancelIcon.png";

import BoardSection from "./Boardsection";

interface AllBoards {
  board_id: number;
  board_name: string;
}
interface Props {
  boards: AllBoards[];
  workspaceId: any;
  workspaceName: string;
}

function BoardsAll({ boards, workspaceId, workspaceName }: Props) {
  const [usecreateBoardPopup, setCreateBoardPopup] = useState(false);
  const [usemyBoards, setAllBoards] = useState<AllBoards[]>([
    { board_id: 0, board_name: "" },
  ]);
  const [usenewBoardName, setNewBoardName] = useState("");
  const [useboardsAmount, setBoardsAmount] = useState(0);

  useEffect(() => {
    setAllBoards(boards);
    setBoardsAmount(boards.length);
  }, [boards]);

  useEffect(() => {
    setBoardsAmount(usemyBoards.length);
  }, [usemyBoards]);

  const createNewBoard = async () => {
    const response = await fetch("/api/workspace/" + workspaceId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usenewBoardName, workspaceId }),
    });

    const res = await response.json();

    if (response.status == 201) {
      setAllBoards([...usemyBoards, res]);

      onClickCreateBoardPopup();
      toast.success("Congratulations! New Board Created ", {
        autoClose: 3000,
      });
    } else {
      toast.warn("Failed to create Board ", {
        autoClose: 3000,
      });
    }
  };

  const onClickCreateBoardPopup = () => {
    if (useboardsAmount >= 5) {
      toast.warning("Upgrade to Pro", {
        autoClose: 3000,
      });
      return;
    }

    setNewBoardName("");
    setCreateBoardPopup(!usecreateBoardPopup);
  };

  return (
    <div className="">
      <div className="flex gap-4 items-center">
        <Image src={workspaceLogo} alt="Workspace Log" width={60} height={60} />
        <div className="">
          <p className="text-xl font-bold text-slate-700">{workspaceName}</p>
          <div className="flex gap-2 items-center">
            <Image
              src={membershipIcon}
              alt="membership Icon"
              width={15}
              height={15}
            />
            <p className="text-slate-500 font-normal text-sm">Free</p>
          </div>
        </div>
      </div>
      <div className="w-full h-0.5 bg-slate-100 mt-6"></div>
      <div className="flex mt-6 gap-2 items-center">
        <Image src={userIcon} alt="userIcon" width={25} height={25} />
        <p className="font-bold text-slate-600 text-xl">Your Boards</p>
      </div>

      {/* Board Section */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {usemyBoards.map((item) => {
          return (
            <BoardSection
              key={item.board_id}
              name={item.board_name}
              boardID={item.board_id}
            />
          );
        })}

        <div
          onClick={onClickCreateBoardPopup}
          className="relative max-w-56 h-28 bg-gray-200 rounded-md items-center justify-center flex hover:cursor-pointer"
        >
          <div className="absolute items-center justify-center flex flex-col">
            <p className="text-black font-semibold">Create new board</p>
            <p className="text-gray-700 font-medium">
              {5 - useboardsAmount + " Remainings"}
            </p>
          </div>
        </div>
      </div>

      {/* Create Board Popup */}
      {usecreateBoardPopup && (
        <div className="fixed w-full justify-center items-center flex z-20 top-0 bottom-0 left-0 right-0 m-auto bg-black/50">
          <div className="relative bg-white shadow-lg sm:px-4 px-4 py-3 rounded-lg flex flex-col gap-4 justify-center items-center border-slate-100 border-2">
            <p className="font-semibold">Create Board</p>
            <Image
              onClick={onClickCreateBoardPopup}
              className="absolute right-2 top-4 hover:cursor-pointer"
              src={cancelIcon}
              alt="Close Icon"
              width={20}
              height={20}
            />
            <input
              className="w-60 sm:w-80 border-2 rounded-md px-2"
              type="text"
              name=""
              id=""
              value={usenewBoardName}
              onChange={(e) => {
                setNewBoardName(e.target.value);
              }}
            />
            <button
              onClick={createNewBoard}
              className="bg-blue-900 w-full rounded-md text-white py-2 border-none font-semibold"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardsAll;
