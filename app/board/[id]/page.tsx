"use client";
import React, { MouseEventHandler, ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";

import bgImage from "@/public/backgrounds/backgroundOne.jpg";
import Image from "next/image";
import Navbar from "@/app/_components/Navbarworkspace";
import List from "@/app/_components/List";
import Addlist from "@/app/_components/Addlist";
import crossIcon from "@/public/icons/cancelIcon.png";
import deleteIcon from "@/public/icons/deleteIcon.png";

interface ListCards {
  card_id: number;
  card_description: string;
  card_list_id: number;
  card_order: number;
}

interface AllLists {
  list_id: number;
  list_title: string;
  cards: ListCards[];
  list_order: number;
}

let selectedCardID = 0;
let selectedListID = 0;

function page({ params }: { params: any }) {
  let totalIndex = 0;
  const [allLists, setAllLists] = useState<AllLists[]>([]);
  const [cardPopup, setCardPopup] = useState(false);
  const [cardDesc, setCardDesc] = useState("");

  useEffect(() => {
    getAllLists();
  }, []);

  useEffect(() => {
    console.log(allLists);
  }, [allLists]);

  const getAllLists = async () => {
    const response = await fetch(
      "/api/board/" + params.id + "?boardid=" + params.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const results = await response.json();
    if (results) {
      setAllLists(results);
    }
  };

  const createNewList = async (listName: string) => {
    const listOrder = allLists.length;
    const response = await fetch(
      "/api/board/" + params.id + "?boardid=" + params.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listName, listOrder }),
      }
    );

    const res = await response.json();
    console.log(res);
    if (response.status == 201) {
      setAllLists([...allLists, res]);
      toast.success("New List Added Successfuly ", {
        autoClose: 3000,
      });
    } else {
      toast.error("Failed to create New List ", {
        autoClose: 3000,
      });
    }
  };

  const deleteList = async (listID: string) => {
    const listId = parseInt(listID);
    setAllLists((prevItems) =>
      prevItems.filter((item) => item.list_id !== listId)
    );

    const response = await fetch("/api/board/" + params.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listId }),
    });

    const res = await response.json();
    if (response.status == 200) {
      toast.success("List Deleted Successfuly ", {
        autoClose: 3000,
      });
    } else {
      toast.error("Failed to Delete List", {
        autoClose: 3000,
      });
    }
  };

  const deleteCard = async () => {
    setCardPopup(!cardPopup);
    setAllLists((prevLists) => {
      return prevLists.map((list) => {
        if (list.list_id === selectedListID) {
          // Filter out the card if its ID matches selectedCardID
          const updatedCards = list.cards.filter(
            (card) => card.card_id !== selectedCardID
          );
          return {
            ...list,
            cards: updatedCards,
          };
        }
        return list;
      });
    });

    const response = await fetch("/api/board/card", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selectedCardID }),
    });

    const res = await response.json();
    if (response.status == 200) {
      toast.success("Card Deleted Successfuly ", {
        autoClose: 3000,
      });
    } else {
      toast.error("Failed to Delete Card", {
        autoClose: 3000,
      });
    }
  };

  const cardDetailsEdit = (
    cardID: string,
    cardDescrption: string,
    listID: string
  ) => {
    selectedCardID = parseInt(cardID);
    selectedCardID = selectedCardID - 100000;
    selectedListID = parseInt(listID);

    setCardDesc(cardDescrption);
    setCardPopup(!cardPopup);
  };

  const cardDetailsUpdate = async () => {
    setCardPopup(!cardPopup);
    setAllLists((prevLists) => {
      return prevLists.map((list) => {
        if (list.list_id == selectedListID) {
          return {
            ...list,
            cards: list.cards.map((card) => {
              if (card.card_id == selectedCardID) {
                return { ...card, card_description: cardDesc };
              }
              return card;
            }),
          };
        }
        return list;
      });
    });

    const response = await fetch("/api/board/card", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cardDesc, selectedCardID }),
    });

    if (response.status == 200) {
      toast.success("Card Updated", {
        autoClose: 3000,
      });
    } else {
      toast.error("Card Failed to Update", {
        autoClose: 3000,
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setCardDesc(value);
  };

  const addCardIntoList = (card: ListCards) => {
    console.log(card);

    setAllLists((prevLists: any) => {
      return prevLists.map((list: any) => {
        if (list.list_id === card.card_list_id) {
          // Add the new card to the list of cards
          const newCard = {
            card_id: card.card_id,
            card_description: card.card_description,
          };
          // const updatedCards = [...(list.cards || null), newCard];
          const updatedCards = Array.isArray(list.cards)
            ? [...list.cards, newCard]
            : [newCard];

          return {
            ...list,
            cards: updatedCards,
          };
        }
        return list;
      });
    });
  };

  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  const onDragEnd = async (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // If Dropped in the same Position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // User Moves a List
    if (type === "list") {
      const items = reorder(allLists, source.index, destination.index).map(
        (item, index) => ({ ...item, list_order: index })
      );

      setAllLists(items);
      // Trigger Server Action here
      const response = await fetch("/api/board/listorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });
    }

    // User Moves a Card
    if (type === "card") {
      const newOrderedLists = [...allLists];

      // Source and Destination list
      const sourceList = newOrderedLists.find(
        (list) => list.list_id == source.droppableId
      );
      const destList = newOrderedLists.find(
        (list) => list.list_id == destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // Check if cards not exists on the source List
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards not exists on the Destination List
      if (!destList.cards) {
        destList.cards = [];
      }

      // Moving the card in same list
      if (source.droppableId == destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, idx) => {
          card.card_order = idx;
        });

        sourceList.cards = reorderedCards;
        setAllLists(newOrderedLists);
        // TODO: Trigger Server Call
        const response = await fetch("/api/board/cardorder", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reorderedCards }),
        });

        // User Moves the card into another list
      } else {
        //Remove Card from the source List
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign new List id to moved Card
        movedCard.card_list_id = destination.droppableId;

        // Add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, idx) => {
          card.card_order = idx;
        });

        // Update card order in destination list
        destList.cards.forEach((card, idx) => {
          card.card_order = idx;
        });

        setAllLists(newOrderedLists);
        // TODO: Trigger Server Action

        const response = await fetch("/api/board/cardorderpro", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newOrderedLists }),
        });
      }
    }
  };

  return (
    <div className="flex">
      <div className="absolute -z-10 inset-0">
        <Image
          src={bgImage}
          layout="fill"
          objectFit="cover"
          quality={100}
          alt="bgImage"
        />
      </div>
      <Navbar />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lists" type="list" direction="horizontal">
          {(provided) => (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex"
            >
              {/* <List fakeId="1" fakeIndex={0} cardId="11" cardIndex={0} />
              <List fakeId="2" fakeIndex={1} cardId="12" cardIndex={0} /> */}

              {allLists &&
                allLists.map((item, index) => {
                  totalIndex = index;
                  const sortedCards = item.cards?.sort(
                    (a, b) => a.card_order - b.card_order
                  );

                  return (
                    <List
                      key={item.list_id}
                      listId={item.list_id.toString()}
                      listIndex={index}
                      cards={sortedCards}
                      listTitle={item.list_title}
                      deleteListFunc={deleteList}
                      cardDetailsEditFunc={cardDetailsEdit}
                      addCardIntoListFunc={addCardIntoList}
                    />
                  );
                })}

              <Addlist
                addListIndex={totalIndex + 1}
                createNewListFunc={createNewList}
              />

              {provided.placeholder}
            </ol>
          )}
        </Droppable>
      </DragDropContext>

      {/* Card Popup */}
      {cardPopup && (
        <div className="fixed w-full justify-center items-center flex z-20 top-0 bottom-0 left-0 right-0 m-auto bg-black/50">
          <div className="relative bg-slate-200 shadow-lg sm:px-6 px-6 py-3 rounded-lg flex flex-col gap-5">
            <div className="">
              <p className="font-semibold text-xl">Card Details</p>
              <p className="text-sm text-slate-600">in list in Progress</p>
            </div>

            <Image
              onClick={() => setCardPopup(!cardPopup)}
              className="absolute right-3 hover:cursor-pointer"
              src={crossIcon}
              alt="Cross Icon"
              width={25}
              height={25}
            />

            <Image
              onClick={() => deleteCard()}
              className="absolute right-12 hover:cursor-pointer"
              src={deleteIcon}
              alt="Delete Icon"
              width={25}
              height={25}
            />

            <div className="">
              <p className="font-semibold">Description</p>
              <textarea
                className="w-96 h-20 rounded-sm my-2 outline-none bg-slate-300 px-3 py-2 font-semibold"
                name=""
                id=""
                value={cardDesc}
                onChange={handleChange}
              />
            </div>

            <button
              onClick={cardDetailsUpdate}
              className="bg-blue-950 py-1 text-white rounded-sm"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
