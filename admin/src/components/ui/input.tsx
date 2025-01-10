"use client";
import React from "react";
import { cn } from "@/lib/utils";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { File, Upload } from "lucide-react";

interface FileInputProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
}

function FileInput({ accept, onFileSelect }: FileInputProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFileName(file ? file.name : null);
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="grid w-full items-center space-y-2">
      <div
        onClick={handleButtonClick}
        className="grid h-32 w-full cursor-pointer place-items-center rounded border p-2 hover:border-dashed"
      >
        <File className="text-gray-200" />
      </div>

      <Button variant="secondary" type="button" onClick={handleButtonClick}>
        <Upload /> Choose File
      </Button>
      <input
        accept={accept}
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {fileName && (
        <p className="text-sm text-muted-foreground">Selected: {fileName}</p>
      )}
    </div>
  );
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          type === "file" && "align-middle",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, FileInput };
