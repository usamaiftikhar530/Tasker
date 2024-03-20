import React from "react";

import NavbarWorkspace from "@/app/_components/Navbarworkspace";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavbarWorkspace />
      <div>{children}</div>
    </div>
  );
}

export default layout;
