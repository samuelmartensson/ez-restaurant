import { LoaderPinwheel } from "lucide-react";
import React from "react";

const AppLoader = () => {
  return (
    <div className="grid h-svh w-svw place-items-center">
      <div className="grid place-items-center">
        <LoaderPinwheel size={48} className="animate-spin" />
        <h1 className="text-3xl">EZ Rest</h1>
      </div>
    </div>
  );
};

export default AppLoader;
