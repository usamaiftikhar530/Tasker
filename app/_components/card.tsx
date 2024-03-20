"use client";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";

import Image from "next/image";

function Card({
  cardID,
  cardIndex,
  cardDescrption,
  cardDetailsEditListFunc,
}: {
  cardID: string;
  cardIndex: number;
  cardDescrption: string;
  cardDetailsEditListFunc: (cardID: string, cardDescrption: string) => void;
}) {
  return (
    <Draggable draggableId={cardID} index={cardIndex}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="bg-white px-2 py-2 rounded-sm my-2"
          onClick={() => cardDetailsEditListFunc(cardID, cardDescrption)}
        >
          <p className="font-semibold">{cardDescrption}</p>
        </div>
      )}
    </Draggable>
  );
}

export default Card;
