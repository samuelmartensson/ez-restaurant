import { ReactNode } from "react";

const ActionBar = ({ children }: { children: ReactNode }) => {
  return <div className="flex justify-end border-t-2 pt-4">{children}</div>;
};

export default ActionBar;
