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
  PostSectionHeroMutationBody,
  usePostSectionHero,
} from "@/generated/endpoints";
import { mapToLocalizedFields } from "@/utils/mapToLocalizedFields";
import { useForm } from "react-hook-form";

const inputSchema = [
  {
    id: "SiteName",
    label: "Name",
  },
] as const;

const OnboardingSite = ({ onNextClick }: { onNextClick: () => void }) => {
  const { selectedDomain, selectedLanguage, selectedConfig } = useDataContext();
  const { mutateAsync: uploadHero, isPending } = usePostSectionHero();
  const form = useForm<PostSectionHeroMutationBody>();

  async function onSubmit(data: PostSectionHeroMutationBody) {
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
    onNextClick();
  }

  return (
    <Form {...form}>
      <div>
        <h2 className="mb-2 text-xl">Site setup</h2>
        <p className="mb-8 text-pretty text-muted-foreground">
          Next, give your site a name, formatted like you would market it.
        </p>
        <form
          className="grid w-full gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {inputSchema.map((input) => (
            <FormField
              key={input.id}
              control={form.control}
              name={`localizedFields.${selectedLanguage}.siteName`}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          ))}
          <Button
            disabled={
              isPending ||
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
