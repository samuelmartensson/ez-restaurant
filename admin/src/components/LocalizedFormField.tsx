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
  const { selectedConfig, selectedLanguage, setSelectedLanguage } =
    useDataContext();
  const [internalSelectedLanguage, setInternalSelectedLanguage] =
    useState(selectedLanguage);

  useEffect(() => {
    setInternalSelectedLanguage(selectedLanguage);
  }, [selectedLanguage]);

  return (
    <div>
      <div className="flex gap-1">
        <Tabs
          value={internalSelectedLanguage}
          onValueChange={(lang) => {
            setSelectedLanguage(lang);
          }}
        >
          <TabsList className="justify-start md:h-11">
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
      <div key={selectedLanguage}>
        {children(`${selectedLanguage}.${name}`)}
      </div>
    </div>
  );
};

export default LocalizedFormField;
