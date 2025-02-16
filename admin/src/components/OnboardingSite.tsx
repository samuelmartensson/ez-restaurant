"use client";

import { useDataContext } from "@/components/DataContextProvider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  postCustomerLanguages,
  PostHeroMutationBody,
  usePostHero,
} from "@/generated/endpoints";
import { mapToLocalizedFields } from "@/utils/mapToLocalizedFields";
import { useForm } from "react-hook-form";
import { LanguagePicker } from "./LanguagePicker";
import { useState } from "react";

const OnboardingSite = ({ onNextClick }: { onNextClick: () => void }) => {
  const { selectedDomain, selectedLanguage, selectedConfig } = useDataContext();
  const { mutateAsync: uploadHero, isPending } = usePostHero();
  const form = useForm<PostHeroMutationBody>();
  const [defaultLanguageValue, setDefaultLanguage] = useState("");

  async function onSubmit(data: PostHeroMutationBody) {
    await uploadHero({
      params: { key: selectedDomain },
      data: {
        localizedFields: mapToLocalizedFields(
          selectedConfig?.languages ?? [],
          data.localizedFields || {},
          ["siteName"],
        ),
      },
    });
    await postCustomerLanguages(
      {
        Languages: [defaultLanguageValue],
        DefaultLanguage: defaultLanguageValue,
      },
      {
        Key: selectedDomain,
        Language: selectedLanguage,
      },
    );
    onNextClick();
  }

  return (
    <Form {...form}>
      <div>
        <h2 className="mb-2 text-xl">Site setup</h2>
        <p className="mb-2">Choose your default language.</p>
        <div className="mb-6">
          <LanguagePicker
            onChange={(val) => setDefaultLanguage(val)}
            defaultLanguage={defaultLanguageValue ?? ""}
            languages={selectedConfig?.availableLanguages ?? []}
          />
        </div>
        <p className="mb-2 text-pretty">
          Next, give your site a name, formatted like you would market it.
        </p>
        <form
          className="grid w-full gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            defaultValue=""
            name={`localizedFields.${selectedLanguage}.siteName`}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="EZ Pizza" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button
            disabled={
              isPending ||
              !defaultLanguageValue ||
              form
                .watch(`localizedFields.${selectedLanguage}.siteName`)
                ?.trim() === ""
            }
            type="submit"
          >
            Next
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default OnboardingSite;
