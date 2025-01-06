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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("h-32 w-32 rounded bg-gray-100 object-contain", className)}
      src={previewUrl}
      alt=""
    />
  );
}

export default FilePreview;
