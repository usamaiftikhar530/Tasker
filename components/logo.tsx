"use client";
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";
import { useEffect } from "react";

const headingFont = localFont({
  src: "../public/fonts/font.woff2",
});

function logo({ workspaceID }: { workspaceID: number }) {
  return (
    <Link href={workspaceID !== 0 ? "/workspace/" + workspaceID : "/"}>
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src="/logo.svg" alt="logo" height={30} width={30} />
        <p
          className={cn("text-lg text-neutral-700 pb-1", headingFont.className)}
        >
          Tasker
        </p>
      </div>
    </Link>
  );
}

export default logo;
