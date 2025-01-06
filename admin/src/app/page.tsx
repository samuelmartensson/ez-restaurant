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
import { Switch } from "@/components/ui/switch";
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
  },
  {
    id: "SiteMetaTitle",
    label: "Short description / Slogan",
  },
  {
    id: "Currency",
    label: "Currency",
  },
  {
    id: "Adress",
    label: "Adress",
  },
  {
    id: "Phone",
    label: "Phone",
  },
  {
    id: "Email",
    label: "Email",
  },
  {
    id: "InstagramUrl",
    label: "Instagram URL",
  },
  {
    id: "MapUrl",
    label: "Map URL",
  },
] as const;

const toggleInputSchema = [
  {
    id: "ContactFormVisible",
    label: "Contact form",
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
      InstagramUrl: "",
      MapUrl: "",
      Currency: "",
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
      InstagramUrl: customerConfig.instagramUrl ?? "",
      Currency: customerConfig.currency ?? "",
      MapUrl: customerConfig.mapUrl ?? "",
      ContactFormVisible: customerConfig.sectionVisibility?.contactFormVisible,
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

    const updated = await refetch();
    // Rerender font preview
    form.setValue("Font", updated.data?.font ?? "");
    toast.success("Site information saved.");
  }

  return (
    <Form {...form}>
      <form
        className="grid max-w-lg gap-4 overflow-auto"
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
        <FormField
          control={form.control}
          name="Theme"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Theme</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Theme</SelectLabel>
                        {THEMES.filter(Boolean).map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="mb-4 flex flex-wrap gap-2">
          {assetsInputSchema.map((input) => (
            <FormField
              key={input.id}
              control={form.control}
              name={input.id}
              render={({ field }) => {
                return (
                  <FormItem className="flex-1">
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                      {field.value && field.value !== ACTIONS.REMOVE ? (
                        <div className="grid gap-2">
                          {input.type === "image" && (
                            <>
                              {uploadedAssets?.[field.name] ? (
                                <FilePreview
                                  file={uploadedAssets[field.name]}
                                />
                              ) : (
                                <>
                                  {field.value &&
                                  form.watch(field.name) !== ACTIONS.REMOVE ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      className="mx-auto h-32 w-32 rounded bg-gray-100 object-contain"
                                      src={field.value as string}
                                      alt=""
                                    />
                                  ) : (
                                    <div className="grid h-32 w-32 place-items-center rounded bg-gray-100 p-2 text-xs text-primary">
                                      No image
                                    </div>
                                  )}
                                </>
                              )}
                            </>
                          )}
                          {input.type === "file" && (
                            <>
                              {!(field.value as unknown as File)?.name && (
                                <style>{`
                                  @font-face {
                                    font-family: "Customer";
                                    src: url("${field.value}");
                                  }
                            `}</style>
                              )}
                              <div
                                className="grid h-32 place-items-center rounded bg-gray-100 px-2 py-1"
                                style={{
                                  fontFamily: (field.value as unknown as File)
                                    ?.name
                                    ? "inherit"
                                    : "Customer",
                                }}
                              >
                                {(field.value as unknown as File)?.name ?? (
                                  <div className="grid place-items-center gap-1">
                                    <span>My font</span>
                                    <span>MY FONT</span>
                                  </div>
                                )}
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
                          accept={
                            input.type === "image"
                              ? "image/*"
                              : ".woff, .woff2, .otf, .ttf"
                          }
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
        </div>
        <div className="mb-4">
          <h2 className="mb-6 text-xl">Section visibility</h2>
          {toggleInputSchema.map((input) => (
            <FormField
              key={input.id}
              control={form.control}
              name={input.id}
              render={({ field }) => {
                return (
                  <FormItem className="flex items-center">
                    <FormLabel className="pb-0">{input.label}</FormLabel>
                    <FormControl>
                      <Switch
                        defaultChecked={false}
                        className="ml-2"
                        checked={!!field.value}
                        onCheckedChange={(checked) => {
                          form.setValue(field.name, checked);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          ))}
        </div>
        <Button disabled={isPending} type="submit">
          <Save /> Save
        </Button>
      </form>
    </Form>
  );
};

export default Wrapper;
