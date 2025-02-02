"use client";
/* eslint-disable @next/next/no-img-element */
import React, { ReactNode, useState } from "react";
import { createPortal } from "react-dom";

const ImageViewer = ({
  url,
  children,
}: {
  children: ReactNode;
  url: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {createPortal(
        <div
          style={{
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
          }}
          onClick={() => setIsOpen(false)}
          className="duration-200 fixed inset-0 grid place-items-center bg-white/90 z-[99]"
        >
          <img
            style={{
              transform: isOpen ? "translateY(0px)" : "translateY(-8px)",
            }}
            loading="lazy"
            className="duration-300 w-11/12 max-w-screen-sm max-h-[80svh] object-contain"
            src={url}
            alt=""
          />
        </div>,
        document.body
      )}
      <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
        {children}
      </div>
    </>
  );
};

export default ImageViewer;
