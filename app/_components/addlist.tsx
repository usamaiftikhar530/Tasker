"use client";
import Image from "next/image";
import React, { MouseEventHandler, useEffect } from "react";
import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ChangeEvent } from "react";
import { toast } from "react-toastify";

import plusIcon from "@/public/icons/plusIcon.png";
import crossIcon from "@/public/icons/cancelIcon.png";

function addlist({
  addListIndex,
  createNewListFunc,
}: {
  addListIndex: number;
  createNewListFunc: (listName: string) => void;
}) {
  const [listForm, setListForm] = useState(false);
  const [listName, setListName] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setListName(value);
  };

  const onClickAddListBtn = () => {
    if (listName.length > 1) {
      createNewListFunc(listName);
      onClickAddCard();
    } else {
      toast.error("List Name is too Short ", {
        autoClose: 3000,
      });
    }
  };

  const ListForm = () => {
    return (
      //  <form action="">
      <div className="">
        <textarea
          className="resize-none w-full rounded-md px-2 h-20 outline-none py-2"
          name=""
          id=""
          placeholder="Enter a title for List"
          onChange={handleChange}
        />
        <div className="flex my-3 items-center gap-4 pb-2">
          <button
            onClick={onClickAddListBtn}
            className="bg-sky-800 rounded-sm px-2 py-1  text-white font-normal"
          >
            Add List
          </button>
          <Image
            onClick={onClickAddCard}
            className="hover:cursor-pointer"
            src={crossIcon}
            alt="Cancel Icon"
            width={25}
            height={25}
          />
        </div>
      </div>
      //  </form>
    );
  };

  const onClickAddCard = () => {
    setListName("");
    setListForm(!listForm);
  };

  return (
    <Draggable draggableId={"156"} index={addListIndex}>
      {(provided) => (
        <li {...provided.draggableProps} ref={provided.innerRef} className="">
          <div className="min-w-60 max-w-60 bg-slate-200 mx-3 rounded-sm px-2 hover:cursor-pointer">
            <div
              {...provided.dragHandleProps}
              className="flex mx-1 px-3 py-2 justify-between"
            >
              <div className="font-semibold">add new list</div>
              <div className="font-bold text-lg"></div>
            </div>

            {listForm ? (
              ListForm()
            ) : (
              <div
                onClick={onClickAddCard}
                className="flex hover:cursor-pointer px-5 py-2 items-center gap-3"
              >
                <Image
                  className="opacity-40"
                  src={plusIcon}
                  alt="Plus Icon"
                  width={15}
                  height={15}
                />
                <p className="font-bold text-slate-500">Add a list</p>
              </div>
            )}
          </div>
        </li>
      )}
    </Draggable>
  );
}

export default addlist;
