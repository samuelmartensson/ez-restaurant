"use client";

import * as React from "react";
import { Check, ChevronDown, Languages } from "lucide-react";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="font-customer text-primary justify-start gap-2"
        >
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
