"use client";

import { useDataContext } from "@/components/DataContextProvider";
import FilePreview from "@/components/FilePreview";
import FormLayout from "@/components/FormLayout";
import hasDomain from "@/components/hasDomain";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PostCustomerSiteConfigurationBody,
  useGetPublicGetCustomerConfig,
  usePostCustomerSiteConfiguration,
  usePostCustomerSiteConfigurationAssets,
} from "@/generated/endpoints";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const inputSchema = [
  {
    id: "SiteName",
    label: "Name",
    type: "text",
  },
  {
    id: "SiteMetaTitle",
    label: "Site meta title",
    type: "text",
  },

  {
    id: "Adress",
    label: "Adress",
    type: "text",
  },
  {
    id: "Phone",
    label: "Phone",
    type: "text",
  },
  {
    id: "Email",
    label: "Email",
    type: "text",
  },
  {
    id: "Theme",
    label: "Theme",
    type: "select",
  },
] as const;

const assetsInputSchema = [
  {
    id: "Logo",
    label: "Logo",
    type: "image",
  },
  {
    id: "Font",
    label: "Font",
    type: "file",
  },
] as const;

const THEMES = ["modern", "rustic"];

const ACTIONS = {
  REMOVE: "REMOVE",
};

const Wrapper = () => <FormLayout title="Site">{hasDomain(Site)()}</FormLayout>;

const Site = () => {
  const { selectedDomain } = useDataContext();
  const [uploadedAssets, setUploadedAssets] = useState<Record<string, File>>(
    {},
  );
  const form = useForm<PostCustomerSiteConfigurationBody>({
    defaultValues: {
      SiteName: "",
      SiteMetaTitle: "",
      Logo: "",
      Theme: "",
      Adress: "",
      Phone: "",
      Email: "",
    },
  });

  const { data: customerConfig, refetch } = useGetPublicGetCustomerConfig(
    {
      key: selectedDomain,
    },
    { query: { enabled: !!selectedDomain } },
  );

  const { mutateAsync: uploadSiteConfiguration, isPending: isPendingData } =
    usePostCustomerSiteConfiguration();

  const {
    mutateAsync: uploadSiteConfigurationAssets,
    isPending: isPendingAssets,
  } = usePostCustomerSiteConfigurationAssets();

  const isPending = isPendingAssets || isPendingData;

  useEffect(() => {
    if (!customerConfig) return;

    form.reset({
      SiteName: customerConfig.siteName ?? "",
      SiteMetaTitle: customerConfig.siteMetaTitle ?? "",
      Logo: customerConfig.logo ?? "",
      Font: customerConfig.font ?? "",
      Theme: customerConfig.theme ?? "",
      Adress: customerConfig.adress ?? "",
      Phone: customerConfig.phone ?? "",
      Email: customerConfig.email ?? "",
    });
  }, [customerConfig, form]);

  async function onSubmit(data: PostCustomerSiteConfigurationBody) {
    const params = { key: selectedDomain };
    await uploadSiteConfigurationAssets({
      data: {
        ...uploadedAssets,
      },
      params,
    });
    await uploadSiteConfiguration({
      data: {
        ...data,
        Logo: data.Logo === ACTIONS.REMOVE ? ACTIONS.REMOVE : "",
        Font: data.Font === ACTIONS.REMOVE ? ACTIONS.REMOVE : "",
      },
      params,
    });

    refetch();
    toast.success("Site information saved.");
  }

  return (
    <Form {...form}>
      <form
        className="grid max-w-lg gap-4 overflow-auto p-4"
        onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
      >
        {inputSchema.map((input) => (
          <FormField
            key={input.id}
            control={form.control}
            name={input.id}
            render={({ field }) => {
              let render = <Input {...field} />;

              if (input.type === "select") {
                render = (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{input.label}</SelectLabel>
                        {THEMES.filter(Boolean).map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
              }

              return (
                <FormItem>
                  <FormLabel>{input.label}</FormLabel>
                  <FormControl>{render}</FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        ))}
        {assetsInputSchema.map((input) => (
          <FormField
            key={input.id}
            control={form.control}
            name={input.id}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>{input.label}</FormLabel>
                  <FormControl>
                    {field.value && field.value !== ACTIONS.REMOVE ? (
                      <div className="grid justify-start gap-2">
                        {input.type === "image" && (
                          <>
                            {uploadedAssets?.[field.name] ? (
                              <FilePreview file={uploadedAssets[field.name]} />
                            ) : (
                              <>
                                {field.value &&
                                form.watch(field.name) !== ACTIONS.REMOVE ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    className="h-20 w-20 rounded bg-gray-100 object-contain"
                                    src={field.value as string}
                                    alt=""
                                  />
                                ) : (
                                  <div className="grid h-20 w-20 place-items-center rounded bg-gray-100 p-2 text-xs text-primary">
                                    No image
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                        {input.type === "file" && (
                          <>
                            <div className="grid h-20 w-20 place-items-center rounded bg-gray-100 p-2 text-xs text-primary">
                              {(field.value as unknown as File).name}
                            </div>
                          </>
                        )}
                        <Button
                          className="block"
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            if (field.value) {
                              form.setValue(field.name, ACTIONS.REMOVE);
                            }
                            setUploadedAssets((state) => {
                              const newState = { ...state };
                              delete newState[field.name];

                              return newState;
                            });
                          }}
                        >
                          Remove file
                        </Button>
                      </div>
                    ) : (
                      <Input
                        type="file"
                        accept={input.type === "image" ? "image/*" : ""}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            setUploadedAssets((state) => ({
                              ...state,
                              [field.name]: file,
                            }));
                            form.setValue(
                              field.name,
                              file as unknown as string,
                            );
                          }
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        ))}
        <Button disabled={isPending} type="submit">
          <Save /> Save
        </Button>
      </form>
    </Form>
  );
};

export default Wrapper;
