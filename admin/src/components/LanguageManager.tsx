"use client";

import { postCustomerLanguages } from "@/generated/endpoints";
import { useEffect, useState } from "react";
import { useDataContext } from "./DataContextProvider";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Save } from "lucide-react";
import { LanguagePicker } from "./LanguagePicker";
import { toast } from "sonner";

const LanguageManager = () => {
  const {
    selectedConfig,
    selectedDomain,
    selectedLanguage,
    refetch: refetchCustomer,
  } = useDataContext();

  const params = {
    Key: selectedDomain,
    Language: selectedLanguage,
  };
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [defaultLanguageValue, setDefaultLanguage] = useState("");

  const { availableLanguages, languages, defaultLanguage } =
    selectedConfig || {};

  const onSubmitInternal = async () => {
    await postCustomerLanguages(
      { Languages: selectedLanguages, DefaultLanguage: defaultLanguageValue },
      params,
    );
    refetchCustomer();
    toast.success("Languages updated.");
  };

  useEffect(() => {
    setSelectedLanguages(languages ?? []);
  }, [languages]);

  useEffect(() => {
    if (!defaultLanguageValue) setDefaultLanguage(defaultLanguage ?? "");
  }, [defaultLanguage, defaultLanguageValue]);

  if (!availableLanguages || !languages) return null;

  return (
    <div className="grid gap-6">
      <LanguagePicker
        onChange={(val) => setDefaultLanguage(val)}
        defaultLanguage={defaultLanguageValue ?? ""}
        languages={selectedLanguages}
      />
      <div className="grid gap-2">
        {availableLanguages?.map((lang) => (
          <div key={lang}>
            <Switch
              disabled={
                selectedLanguages.length === 1 &&
                selectedLanguages.includes(lang)
              }
              onCheckedChange={(checked) => {
                setSelectedLanguages((s) => {
                  if (checked) {
                    return [...s, lang];
                  }

                  const result = s.filter((l) => l !== lang);
                  if (defaultLanguageValue === lang) {
                    setDefaultLanguage(result[0]);
                  }

                  return result;
                });
              }}
              defaultChecked={languages?.includes(lang)}
            />{" "}
            {lang}
          </div>
        ))}
      </div>
      <Button
        className="fixed inset-x-6 bottom-4 max-w-lg md:left-[--sidebar-width] md:ml-6"
        onClick={() => onSubmitInternal()}
      >
        <Save /> Save
      </Button>
    </div>
  );
};

export default LanguageManager;
