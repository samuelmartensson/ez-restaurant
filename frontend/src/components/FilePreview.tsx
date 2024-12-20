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
      className="h-20 w-20 object-contain bg-gray-100 rounded"
      src={previewUrl}
      alt=""
    />
  );
}

export default FilePreview;
