import React, { useState, useEffect } from "react";

function FilePreview({ file }: { file: File }) {
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
      className="h-32 w-32 rounded bg-gray-100 object-contain"
      src={previewUrl}
      alt=""
    />
  );
}

export default FilePreview;
