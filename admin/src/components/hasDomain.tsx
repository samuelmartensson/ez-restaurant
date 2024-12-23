"use client";
import Link from "next/link";
import { JSX } from "react";
import { useDataContext } from "./DataContextProvider";
import { Button } from "./ui/button";

const Wrapper = (Component: () => JSX.Element) => {
  return function Export() {
    const { configs } = useDataContext();

    if (configs.length === 0) {
      return (
        <div className="grid place-items-center h-full w-full">
          <div className="grid place-items-center gap-2">
            <div>Create a domain first</div>
            <Link href="/domain">
              <Button>Go to Domains</Button>
            </Link>
          </div>
        </div>
      );
    }

    return <Component />;
  };
};

export default Wrapper;
