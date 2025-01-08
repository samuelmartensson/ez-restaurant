"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";

interface Props {
  defaultLanguage?: string;
  languages: string[];
  onChange: (value: string) => void;
}

export function LanguagePicker({
  onChange,
  languages,
  defaultLanguage,
}: Props) {
  return (
    <div>
      <Label>Default language</Label>
      <Select
        onValueChange={(val) => {
          onChange(val);
          console.log(val);
        }}
        value={defaultLanguage}
      >
        <SelectTrigger>
          <SelectValue placeholder={defaultLanguage} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Default language</SelectLabel>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
