import React from "react";
import Image from "next/image";
import backgroundOne from "@/public/backgrounds/backgroundOne.jpg";
import { useRouter } from "next/navigation";

function Boardsection({ name, boardID }: { name: string; boardID: number }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/board/" + boardID)}
      className="relative max-w-56 h-28 hover:cursor-pointer"
    >
      <Image
        className="w-full h-full rounded-md brightness-90"
        src={backgroundOne}
        alt="Background One"
      />
      <p className="absolute top-2 left-2 text-white font-semibold">{name}</p>
    </div>
  );
}

export default Boardsection;
