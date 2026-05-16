"use client";
import { useDataContext } from "@/components/DataContextProvider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode, useEffect, useState } from "react";

const LocalizedFormField = <T extends string>({
  children,
  name,
}: {
  name: T;
  children: (name: `${string}.${T}`) => ReactNode;
}) => {
  const { selectedConfig, selectedLanguage } = useDataContext();
  const [internalSelectedLanguage, setInternalSelectedLanguage] =
    useState(selectedLanguage);

  useEffect(() => {
    setInternalSelectedLanguage(selectedLanguage);
  }, [selectedLanguage]);

  return (
    <div>
      {selectedConfig?.languages && selectedConfig?.languages?.length > 1 && (
        <div className="flex gap-1">
          <Tabs
            value={internalSelectedLanguage}
            onValueChange={(lang) => {
              setInternalSelectedLanguage(lang);
            }}
          >
            <TabsList className="h-8 justify-start p-0.5">
              {selectedConfig?.languages?.map((lang) => (
                <TabsTrigger
                  aria-label={`Menu category ${lang}`}
                  value={lang}
                  key={lang}
                >
                  {lang}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}
      <div key={internalSelectedLanguage}>
        {children(`${internalSelectedLanguage}.${name}`)}
      </div>
    </div>
  );
};

export default LocalizedFormField;
