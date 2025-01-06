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
  PostCustomerSiteConfigurationBody,
  usePostCustomerSiteConfiguration,
} from "@/generated/endpoints";
import { useForm } from "react-hook-form";

const inputSchema = [
  {
    id: "SiteName",
    label: "Name",
  },
] as const;

const OnboardingSite = ({ onNextClick }: { onNextClick: () => void }) => {
  const { selectedDomain } = useDataContext();
  const form = useForm<PostCustomerSiteConfigurationBody>({
    defaultValues: {
      SiteName: "",
      SiteMetaTitle: "",
      Logo: "",
      Theme: "",
      Adress: "",
      Phone: "",
      Email: "",
      InstagramUrl: "",
      MapUrl: "",
    },
  });

  const { mutateAsync: uploadSiteConfiguration, isPending: isPendingData } =
    usePostCustomerSiteConfiguration();

  const isPending = isPendingData;

  async function onSubmit(data: PostCustomerSiteConfigurationBody) {
    const params = { key: selectedDomain };
    await uploadSiteConfiguration({
      data: {
        ...data,
        SiteMetaTitle: "-",
        Theme: "modern",
        Logo: "",
        Font: "",
      },
      params,
    });
    onNextClick();
  }

  return (
    <Form {...form}>
      <div>
        <h1 className="mb-2 text-xl">Site setup</h1>
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
              name={input.id}
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
            disabled={isPending || form.watch("SiteName")?.trim() === ""}
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
