/* eslint-disable @next/next/no-img-element */
import React from "react";
import ImageViewer from "./ImageViewer";
import { Separator } from "./ui/separator";

interface Props {
  urls: string[];
}

const Gallery = ({ urls }: Props) => {
  return (
    <div className="p-4 max-w-screen-xl m-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
        {urls.map((url) => (
          <ImageViewer key={url} url={url}>
            <img
              loading="lazy"
              alt=""
              className="rounded aspect-square h-full w-full object-cover"
              src={url}
            />
          </ImageViewer>
        ))}
      </div>
      <Separator className="my-8 max-w-screen-lg mx-auto" decorative />
    </div>
  );
};

export default Gallery;
