"use client";

import { ChevronDown, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setCookie } from "@/utils";
import { useEffect, useState } from "react";

interface Props {
  defaultLanguage?: string;
  languages: string[];
}

export function LanguagePicker({ languages, defaultLanguage }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    defaultLanguage ?? languages?.[0]
  );

  useEffect(() => {
    const fn = () => {
      setOpen(false);
    };

    document.addEventListener("scroll", fn);
    return () => document.removeEventListener("scroll", fn);
  }, []);

  if (languages.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="font-customer justify-start gap-2">
          <Languages className="h-4 w-4" />
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuCheckboxItem
            key={language}
            checked={selectedLanguage === language}
            onCheckedChange={() => {
              setSelectedLanguage(language);
              setCookie("lang", language, 7);
              window.location.reload();
            }}
          >
            {language}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
