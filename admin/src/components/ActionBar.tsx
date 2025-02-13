import { ReactNode } from "react";

const ActionBar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed inset-x-6 bottom-4 max-w-lg md:left-[--sidebar-width] md:ml-6">
      {children}
    </div>
  );
};

export default ActionBar;
