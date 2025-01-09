"use client";

import CycleLanguageLabel from "@/components/CycleLanguageLabel";
import { useDataContext } from "@/components/DataContextProvider";
import FilePreview from "@/components/FilePreview";
import FormLayout from "@/components/FormLayout";
import hasDomain from "@/components/hasDomain";
import LanguageManager from "@/components/LanguageManager";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { getThemePrimaryFromConfig, getTheme } from "@/utils/theme";
import { Save, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const inputSchema = [
  {
    id: "SiteName",
    label: "Name",
    translate: true,
  },
  {
    id: "SiteMetaTitle",
    label: "Short description / Slogan",
    translate: true,
  },
  {
    id: "Currency",
    label: "Currency",
    translate: false,
  },
  {
    id: "Adress",
    label: "Adress",
    translate: false,
  },
  {
    id: "Phone",
    label: "Phone",
    translate: false,
  },
  {
    id: "Email",
    label: "Email",
    translate: false,
  },
  {
    id: "InstagramUrl",
    label: "Instagram URL",
    translate: false,
  },
  {
    id: "MapUrl",
    label: "Map URL",
    translate: false,
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
  const { selectedDomain, selectedLanguage, setSelectedLanguage } =
    useDataContext();
  const [uploadedAssets, setUploadedAssets] = useState<Record<string, File>>(
    {},
  );
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
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
      Key: selectedDomain,
      Language: selectedLanguage,
    },
    { query: { enabled: !!selectedDomain && !!selectedLanguage } },
  );

  const { mutateAsync: uploadSiteConfiguration, isPending: isPendingData } =
    usePostCustomerSiteConfiguration();

  const {
    mutateAsync: uploadSiteConfigurationAssets,
    isPending: isPendingAssets,
  } = usePostCustomerSiteConfigurationAssets();

  const currentThemePrimary = useMemo(
    () => getThemePrimaryFromConfig(customerConfig?.themeColorConfig ?? ""),
    [customerConfig?.themeColorConfig],
  );

  const isPending = isPendingAssets || isPendingData || isGeneratingTheme;

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
      ThemeColorConfig: currentThemePrimary,
    });
  }, [currentThemePrimary, customerConfig, form]);

  async function onSubmit(data: PostCustomerSiteConfigurationBody) {
    const params = { Key: selectedDomain, Language: selectedLanguage };
    let themeConfig = customerConfig?.themeColorConfig;

    if (currentThemePrimary !== data.ThemeColorConfig) {
      try {
        setIsGeneratingTheme(true);
        const loadId = "theme";
        toast.loading("Generating theme...", { id: loadId });
        themeConfig = await getTheme(data.ThemeColorConfig ?? "");
        toast.dismiss(loadId);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        toast.error("Theme could not be generated.");
      } finally {
        setIsGeneratingTheme(false);
      }
    }

    await uploadSiteConfiguration({
      data: {
        ...data,
        ThemeColorConfig: themeConfig,
        Logo: data.Logo === ACTIONS.REMOVE ? ACTIONS.REMOVE : "",
        Font: data.Font === ACTIONS.REMOVE ? ACTIONS.REMOVE : "",
      },
      params,
    });
    await uploadSiteConfigurationAssets({
      data: {
        ...uploadedAssets,
      },
      params,
    });
    const updated = await refetch();
    if (!updated.data?.languages?.includes(selectedLanguage)) {
      setSelectedLanguage(updated.data?.languages?.[0] ?? "");
    }
    // Rerender font preview
    form.setValue("Font", updated.data?.font ?? "");
    toast.success("Site information saved.");
  }

  return (
    <Form {...form}>
      <form
        className="relative grid max-w-lg gap-4 overflow-auto pb-20"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2 overflow-auto">
          <div>Languages</div>
          <div className="flex w-full gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Settings />
                  <span>Manage languages</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Languages</DialogTitle>
                  <DialogDescription>
                    Enable the languages you want to display on your website.
                  </DialogDescription>
                </DialogHeader>
                <LanguageManager />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {inputSchema.map((input) => (
          <FormField
            key={input.id}
            control={form.control}
            name={input.id}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    {input.translate ? (
                      <CycleLanguageLabel label={input.label} />
                    ) : (
                      input.label
                    )}
                  </FormLabel>
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
        <FormField
          control={form.control}
          name="ThemeColorConfig"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Theme Color</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
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
        <Button
          className="fixed inset-x-6 bottom-4 max-w-lg md:left-[--sidebar-width] md:ml-6"
          disabled={isPending}
          type="submit"
        >
          <Save /> Save
        </Button>
      </form>
    </Form>
  );
};

export default Wrapper;
