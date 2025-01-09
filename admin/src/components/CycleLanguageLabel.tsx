"use client";

import { Languages } from "lucide-react";
import { useDataContext } from "./DataContextProvider";
import { Button } from "./ui/button";

interface Props {
  label: string;
}
const CycleLanguageLabel = ({ label }: Props) => {
  const { selectedLanguage, cycleLanguage } = useDataContext();

  return (
    <Button
      variant="ghost"
      onClick={cycleLanguage}
      size="sm"
      type="button"
      className="mb-2 flex items-center gap-1 p-0 text-sm"
    >
      <Languages className="size-4" />{" "}
      <span className="text-xs text-muted-foreground">
        ({selectedLanguage})
      </span>{" "}
      {label}
    </Button>
  );
};

export default CycleLanguageLabel;
