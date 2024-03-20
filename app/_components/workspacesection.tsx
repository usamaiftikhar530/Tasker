"use client";

import Image from "next/image";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";

import workspaceLogo from "@/public/icons/workspaceLogo.png";
import upIcon from "@/public/icons/upIcon.png";
import downIcon from "@/public/icons/downIcon.png";
import boardIcon from "@/public/icons/boardIcon.png";
import activityIcon from "@/public/icons/activityIcon.png";
import settingIcon from "@/public/icons/settingIcon.png";
import billingIcon from "@/public/icons/billingIcon.png";

function Workspacesection({
  id,
  name,
  showProperties,
  workspaceSideBtnFunc,
}: {
  id: number;
  name: string;
  showProperties: boolean;
  workspaceSideBtnFunc: (viewIndex: number) => void;
}) {
  const router = useRouter();
  const [canShowProperties, SetShowProperties] = useState(showProperties);

  function WorkspaceSectionClick() {
    SetShowProperties(!canShowProperties);
  }

  return (
    <div>
      <div className="flex justify-between md:ms-10 ms-5 mt-2 p-2 items-center hover:bg-blue-100 rounded-md hover:cursor-pointer">
        <div
          className="flex justify-between items-center w-full"
          onClick={WorkspaceSectionClick}
        >
          <div className="flex gap-2">
            <div>
              <Image
                src={workspaceLogo}
                alt="Workspace Logo"
                width={30}
                height={30}
              />
            </div>
            <p className="font-medium">{name}</p>
          </div>
          <div>
            {canShowProperties == true ? (
              <Image src={upIcon} alt="Up Icon" width={15} height={15} />
            ) : (
              <Image src={downIcon} alt="Down Icon" width={15} height={15} />
            )}
          </div>
        </div>
      </div>

      <div className={canShowProperties == true ? "" : "hidden"}>
        <div className="flex flex-col md:ms-10 ms-5">
          <div
            onClick={() => {
              workspaceSideBtnFunc(0);
              router.push("/workspace/" + id);
            }}
            className="flex gap-2 items-center p-2 rounded-md ps-10 hover:bg-blue-50 hover:cursor-pointer"
          >
            <Image src={boardIcon} alt="Board Icon" width={20} height={20} />
            <p>Boards</p>
          </div>
        </div>
        <div className="flex flex-col md:ms-10 ms-5">
          <div className="flex gap-2 items-center p-2 rounded-md ps-10 hover:bg-blue-50 hover:cursor-pointer">
            <Image src={activityIcon} alt="Board Icon" width={20} height={20} />
            <p>Activity</p>
          </div>
        </div>
        <div className="flex flex-col md:ms-10 ms-5">
          <div
            onClick={() => {
              workspaceSideBtnFunc(2);
              router.push("/workspace/" + id);
            }}
            className="flex gap-2 items-center p-2 rounded-md ps-10 hover:bg-blue-50 hover:cursor-pointer"
          >
            <Image src={settingIcon} alt="Board Icon" width={20} height={20} />
            <p>Setting</p>
          </div>
        </div>
        <div className="flex flex-col md:ms-10 ms-5">
          <div className="flex gap-2 items-center p-2 rounded-md ps-10 hover:bg-blue-50 hover:cursor-pointer">
            <Image src={billingIcon} alt="Board Icon" width={20} height={20} />
            <p>Billing</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workspacesection;
