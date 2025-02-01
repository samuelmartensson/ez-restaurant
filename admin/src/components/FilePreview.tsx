/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

function FilePreview({ file, className }: { file: File; className?: string }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!previewUrl) return null;
  return (
    <div className={cn("h-32 w-full rounded border p-2", className)}>
      <img
        className={cn("rounded object-contain", "m-auto h-full")}
        src={previewUrl}
        alt=""
      />
    </div>
  );
}

export default FilePreview;
