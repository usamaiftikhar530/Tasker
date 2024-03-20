"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const response = await fetch("/api/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const userInfo = await response.json();
    if (userInfo) {
      router.push("/workspace/" + userInfo?.workspace_id);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <div className="">All Workspaces can be shown here</div>
      <button onClick={getUserData} className="bg-orange-600">
        Get User Data
      </button>
    </div>
  );
}

export default page;
