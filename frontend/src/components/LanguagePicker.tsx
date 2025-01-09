"use client";

import { ChevronDown, Languages } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setCookie } from "@/utils";

interface Props {
  defaultLanguage?: string;
  languages: string[];
}

export function LanguagePicker({ languages, defaultLanguage }: Props) {
  const [selectedLanguage, setSelectedLanguage] = React.useState(
    defaultLanguage ?? languages?.[0]
  );

  if (languages.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="font-customer justify-start gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden md:block">{selectedLanguage}</span>
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
