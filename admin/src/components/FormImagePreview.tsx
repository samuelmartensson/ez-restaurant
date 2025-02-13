/* eslint-disable @next/next/no-img-element */
import React from "react";
import FilePreview from "./FilePreview";
import { cn } from "@/lib/utils";

const FormImagePreview = ({
  file,
  image,
  isStagedDelete,
}: {
  file?: File | Blob;
  image: string;
  isStagedDelete: boolean;
}) =>
  file ? (
    <FilePreview className="m-auto h-32" file={file} />
  ) : (
    <>
      {!isStagedDelete ? (
        <div className="h-32 w-full rounded border p-2">
          <img
            className={cn("rounded border object-contain", "m-auto h-full")}
            src={image}
            alt=""
          />
        </div>
      ) : (
        <div
          className={cn(
            "grid place-items-center rounded border p-2 text-xs text-primary",
            "h-32",
          )}
        >
          No image
        </div>
      )}
    </>
  );

export default FormImagePreview;
