"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { ChangeEvent } from "react";
import { useState } from "react";
import Card from "@/app/_components/card";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";

import plusIcon from "@/public/icons/plusIcon.png";
import crossIcon from "@/public/icons/cancelIcon.png";

interface ListCards {
  card_id: number;
  card_description: string;
  card_list_id: number;
  card_order: number;
}

function List({
  listId,
  listIndex,
  cards,
  listTitle,
  deleteListFunc,
  cardDetailsEditFunc,
  addCardIntoListFunc,
}: {
  listId: string;
  listIndex: number;
  cards: ListCards[];
  listTitle: string;
  deleteListFunc: (listId: string) => void;
  cardDetailsEditFunc: (
    cardID: string,
    cardDescrption: string,
    listID: string
  ) => void;
  addCardIntoListFunc: (card: ListCards) => void;
}) {
  const [listForm, setListForm] = useState(false);
  const [listCards, setListCards] = useState<ListCards[]>([]);
  const [optionPopup, setOptionPopup] = useState(false);
  const [cardDescrption, setCardDescription] = useState("");

  useEffect(() => {
    if (cards) {
      setListCards(cards);
    }
  }, [cards]);

  const AddNewCard = async () => {
    if (cardDescrption.length <= 1) {
      toast.warning("Card Description is Short ", {
        autoClose: 3000,
      });
      return;
    }
    let cardOrder = 0;
    if (listCards) {
      cardOrder = listCards.length;
    }
    const response = await fetch("/api/board/card", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cardDescrption, cardOrder, listId }),
    });

    const res = await response.json();

    if (response.status == 201) {
      addCardIntoListFunc(res);
      if (listCards == null) {
        setListCards(res);
      } else {
        console.log(listCards);

        setListCards([...listCards, res]);
      }

      toast.success("Card Added Successfuly ", {
        autoClose: 3000,
      });
      onClickAddCard();
    } else {
      toast.error("Failed to create Card ", {
        autoClose: 3000,
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setCardDescription(value);
  };

  const ListForm = () => {
    return (
      <div>
        <textarea
          className="resize-none w-full rounded-md px-2 h-20 outline-none py-2"
          name=""
          id=""
          placeholder="Enter Card Description"
          onChange={handleChange}
        />
        <div className="flex my-3 items-center gap-4 pb-2">
          <button
            onClick={AddNewCard}
            className="bg-sky-800 rounded-sm px-2 py-1  text-white font-normal"
          >
            Add card
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
    );
  };

  const onClickAddCard = () => {
    setCardDescription("");
    setListForm(!listForm);
  };

  const onClickDeleteList = () => {
    setOptionPopup(!optionPopup);
    deleteListFunc(listId);
  };

  const cardDetailsEditList = (cardID: string, cardDescrption: string) => {
    cardDetailsEditFunc(cardID, cardDescrption, listId);
  };

  return (
    <Draggable draggableId={listId} index={listIndex}>
      {(provided) => (
        <li {...provided.draggableProps} ref={provided.innerRef} className="">
          <div className="min-w-60 max-w-60 bg-slate-200 mx-3 rounded-sm px-2 hover:cursor-pointer">
            <div
              {...provided.dragHandleProps}
              className="relative flex mx-1 px-3 py-2 justify-between"
            >
              <div className="font-semibold">{listTitle}</div>
              <div
                onClick={() => setOptionPopup(!optionPopup)}
                className="font-bold text-lg hover:cursor-pointer"
              >
                ...
              </div>

              {optionPopup && (
                <div className="absolute flex flex-col bg-slate-600 top-10 right-0 px-2 rounded-sm">
                  <div
                    onClick={onClickDeleteList}
                    className="text-white font-semibold hover:cursor-pointer"
                  >
                    Delete
                  </div>
                </div>
              )}
            </div>

            {/* Cards Here */}
            <Droppable droppableId={listId} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className=""
                >
                  {/* <Card cardID={cardId} cardIndex={cardIndex} /> */}

                  <div>
                    {listCards &&
                      listCards.map((item, index) => {
                        if (item?.card_id) {
                          return (
                            <Card
                              key={item.card_id}
                              cardID={(item.card_id + 100000).toString()}
                              cardIndex={index}
                              cardDescrption={item.card_description}
                              cardDetailsEditListFunc={cardDetailsEditList}
                            />
                          );
                        }
                      })}
                  </div>

                  {provided.placeholder}
                </ol>
              )}
            </Droppable>

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
                <p className="font-bold text-slate-500">Add a card</p>
              </div>
            )}
          </div>
        </li>
      )}
    </Draggable>
  );
}

export default List;
