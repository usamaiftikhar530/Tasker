"use client";

import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { SidebarOpenClose } from "@/redux/features/sidebar-slice";
import { toast } from "react-toastify";

import plusIcon from "@/public/icons/plusIcon.png";
import WorkspaceSection from "@/app/_components/Workspacesection";
import BoardsAll from "@/app/_components/BoardsAll";
import SettingWorkspace from "@/app/_components/Settingworkspace";

import cancelIcon from "@/public/icons/cancelIcon.png";
import { useState, useEffect, ChangeEvent } from "react";
import { setWorkspaces } from "@/redux/features/workspaceslice";
import { useSelector } from "react-redux";

interface Workspace {
  workspace_id: number;
  workspace_name: string;
}

interface AllWorkspaces {
  workspace_id: number;
  workspace_name: string;
}
interface AllBoards {
  board_id: number;
  board_name: string;
}

enum ViewType {
  Board = "BOARD",
  Activity = "ACTIVITY",
  Setting = "SETTING",
  Billing = "BILLING",
}

function Page({ params }: { params: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const isSideBarOpen = useAppSelector(
    (state) => state.sidebarReducer.value.isSideBarOpen
  );
  const [isWorkspacePopupShow, setWorkspacePopupShow] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>({
    workspace_id: 0,
    workspace_name: "",
  });
  const [allWorkspaces, setAllWorkspaces] = useState<AllWorkspaces[]>([
    { workspace_id: 0, workspace_name: "" },
  ]);
  // const [allBoards, setAllBoards] = useState<AllBoards[]>([
  //   { board_id: 0, board_name: "" },
  // ]);
  const [allBoards, setAllBoards] = useState<AllBoards[]>([]);
  const [selectedViewType, setSelectedViewType] = useState<ViewType>(
    ViewType.Board
  );
  const workspaces = useSelector((state: any) => state.workspace.workspaces);

  useEffect(() => {
    getAllWorkspaceData();
    getWorkspaceBoards();
  }, []);

  useEffect(() => {
    setAllWorkspaces(workspaces);
  }, [workspaces]);

  const getAllWorkspaceData = async () => {
    const response = await fetch("/api/workspace", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const results = await response.json();
    setAllWorkspaces(results);
    dispatch(setWorkspaces(results));

    const currentWorkspace = results.find(
      (item: AllWorkspaces) => item.workspace_id == params.id
    );

    setCurrentWorkspace(currentWorkspace);
  };

  const getWorkspaceBoards = async () => {
    const response = await fetch(
      "/api/workspace/" + params.id + "?workspaceid=" + params.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const results = await response.json();
    if (results) {
      setAllBoards(results);
    }
  };

  const createWorkspace = async () => {
    const response = await fetch("/api/workspace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workspaceName),
    });

    const res = await response.json();
    console.log(res);

    if (response.status == 409) {
      toast.warning("Workspace Name Already Exist!", {
        autoClose: 3000,
      });
    } else if (response.status == 201) {
      setAllWorkspaces([...allWorkspaces, res]);

      onClickWorkspacePopupBtn();
      toast.success("Congratulations! New Workspace Created ", {
        autoClose: 3000,
      });
    } else {
      toast.error("Failed To Create Workspace ", {
        autoClose: 3000,
      });
    }
  };

  const onClickWorkspacePopupBtn = () => {
    setWorkspacePopupShow(!isWorkspacePopupShow);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setWorkspaceName(value);
  };

  const onClickWorkspaceSideBtn = (viewIndex: number) => {
    switch (viewIndex) {
      case 0:
        setSelectedViewType(ViewType.Board);
        break;
      case 1:
        setSelectedViewType(ViewType.Activity);
        break;
      case 2:
        setSelectedViewType(ViewType.Setting);
        break;
      case 3:
        setSelectedViewType(ViewType.Billing);
        break;

      default:
        break;
    }
  };

  const onClickSettingBtn = () => {
    setSelectedViewType(ViewType.Setting);
  };

  const renderComponent = () => {
    switch (selectedViewType) {
      case ViewType.Board:
        return (
          <BoardsAll
            boards={allBoards}
            workspaceId={params.id}
            workspaceName={currentWorkspace?.workspace_name}
          />
        );
      case ViewType.Setting:
        return (
          <SettingWorkspace workspaceID={currentWorkspace?.workspace_id} />
        );

      default:
        return null;
    }
  };

  return (
    <div className="">
      {/* Desktop */}
      <div className="flex max-w-screen-2xl mx-auto">
        <div className="min-w-80 hidden md:block">
          <div className="flex justify-between ps-10 mb-5">
            <p className="font-bold">Workspaces</p>
            <div
              onClick={onClickWorkspacePopupBtn}
              className="hover:cursor-pointer"
            >
              <Image src={plusIcon} alt="PlusIcon" width={20} height={20} />
            </div>
          </div>
          {allWorkspaces.map((item, index) => {
            return (
              <WorkspaceSection
                key={index}
                id={item.workspace_id}
                name={item.workspace_name}
                showProperties={false}
                workspaceSideBtnFunc={onClickWorkspaceSideBtn}
              />
            );
          })}

          {/* All Boards  */}
        </div>
        <div className="w-full px-10">{renderComponent()}</div>

        {/* Workspace NAME Popup */}
        {isWorkspacePopupShow && (
          <div className="fixed w-full justify-center items-center flex z-20 top-0 bottom-0 left-0 right-0 m-auto bg-black/50">
            <div className="relative bg-white shadow-lg sm:px-4 px-4 py-3 rounded-lg flex flex-col gap-4 justify-center items-center border-slate-100 border-2">
              <p className="font-bold mt-3 text-slate-600 text-center">
                ENTER WORKSPACE NAME
              </p>
              <div className="mt-4">
                <input
                  className="h-10 w-60 sm:w-80 border-2 rounded-md px-2 outline-none"
                  type="text"
                  name=""
                  id=""
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-center mt-8 gap-3">
                <button
                  onClick={createWorkspace}
                  className="bg-blue-900 px-4 py-2 rounded-md text-white font-semibold"
                >
                  Create
                </button>
                <button
                  onClick={onClickWorkspacePopupBtn}
                  className="bg-slate-700 px-4 py-2 rounded-md text-white font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Mobile */}

      {isSideBarOpen && (
        <div className="fixed top-0 left-0 min-w-60 h-full bg-white block md:hidden">
          <div
            className="absolute top-1 left-2"
            onClick={() => dispatch(SidebarOpenClose())}
          >
            <Image src={cancelIcon} alt="Cancel Icon" width={30} height={30} />
          </div>
          <div className="flex justify-between px-3 mb-5 mt-10">
            <p className=" font-bold">Workspaces</p>
            <div
              onClick={onClickWorkspacePopupBtn}
              className="hover:cursor-pointer"
            >
              <Image src={plusIcon} alt="PlusIcon" width={20} height={20} />
            </div>
          </div>

          {allWorkspaces.map((item, index) => {
            return (
              <WorkspaceSection
                key={index}
                id={item.workspace_id}
                name={item.workspace_name}
                showProperties={false}
                workspaceSideBtnFunc={onClickWorkspaceSideBtn}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Page;
