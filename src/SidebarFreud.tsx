import React from "react";
import { Button } from "./components/ui/button/Button";
import { Icon } from "./components/ui/icon/Icon";

type props = {
  showSettings: Boolean,
  children: any,
  setShowSettings: (bool: boolean) => void
}
export const SidebarFreud = ({ children, showSettings, setShowSettings }: props) => {
  const width = !showSettings ? "w-0" : "w-3/4";

  return (
    <>
      <div className="container absolute top-10 z-50">
        <Button onClick={() => setShowSettings(!showSettings)}>
          <Icon name={"cog"} />
        </Button>
      </div>
      <div
        className={
          "sidebar fixed left-0 top-0 z-40 h-screen overflow-x-hidden bg-beige400 transition-transform " +
          width
        }
      >
        <div className="pt-20">{children}</div>
      </div>
    </>
  );
};
