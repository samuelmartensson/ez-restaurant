"use client";

import {
  postCustomerLanguages,
  useGetPublicGetCustomerConfig,
} from "@/generated/endpoints";
import { useEffect, useState } from "react";
import { useDataContext } from "./DataContextProvider";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Save } from "lucide-react";
import { LanguagePicker } from "./LanguagePicker";
import { toast } from "sonner";

const LanguageManager = () => {
  const {
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
  const { data: customerConfig, refetch } = useGetPublicGetCustomerConfig(
    { ...params, cache: false },
    { query: { enabled: !!selectedDomain && !!selectedLanguage } },
  );

  const { availableLanguages, languages, defaultLanguage } =
    customerConfig || {};

  const onSubmitInternal = async () => {
    await postCustomerLanguages(
      { Languages: selectedLanguages, DefaultLanguage: defaultLanguageValue },
      params,
    );
    refetch();
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
      <Button className="mt-4" onClick={() => onSubmitInternal()}>
        <Save /> Save
      </Button>
    </div>
  );
};

export default LanguageManager;
