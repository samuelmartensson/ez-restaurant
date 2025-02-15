"use client";

import { useDataContext } from "@/components/DataContextProvider";
import FormImagePreview from "@/components/FormImagePreview";
import hasDomain from "@/components/hasDomain";
import LocalizedFormField from "@/components/LocalizedFormField";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileInput, Input } from "@/components/ui/input";
import {
  PostSectionHeroAssetsMutationBody,
  PostSectionHeroMutationBody,
  useGetSectionHero,
  usePostSectionHero,
  usePostSectionHeroAssets,
} from "@/generated/endpoints";
import { mapToLocalizedFields } from "@/utils/mapToLocalizedFields";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const inputSchema = [
  {
    id: "siteName",
    label: "Name",
    translate: true,
    description: "",
  },
  {
    id: "siteMetaTitle",
    label: "Short description / Slogan",
    translate: true,
    description: "",
  },
  {
    id: "orderUrl",
    label: "Order now URL",
    type: "text",
    translate: false,
    description:
      "Populating this field will activate the order button on your website.",
  },
] as const;

const assetsInputSchema = [
  {
    id: "Image",
    label: "Background image",
    type: "image",
  },
] as const;

const Hero = () => {
  const { selectedDomain, selectedLanguage, selectedConfig } = useDataContext();
  const [uploadedAssets, setUploadedAssets] = useState<Record<string, File>>(
    {},
  );
  const [deletedAssets, setDeletedAssets] = useState<Record<string, boolean>>(
    {},
  );
  const form = useForm<
    PostSectionHeroMutationBody & PostSectionHeroAssetsMutationBody
  >({
    defaultValues: {
      Image: "",
      orderUrl: "",
    },
  });

  const { mutateAsync: uploadHero } = usePostSectionHero();
  const { mutateAsync: uploadHeroAssets } = usePostSectionHeroAssets();
  const { data: hero, refetch } = useGetSectionHero({
    Key: selectedDomain,
    Language: selectedLanguage,
  });

  useEffect(() => {
    if (!hero) return;
    console.log(
      mapToLocalizedFields(selectedConfig?.languages ?? [], hero || {}, [
        "siteMetaTitle",
        "siteName",
      ]),
    );

    form.reset({
      Image: hero?.[selectedLanguage]?.heroImage ?? "",
      orderUrl: hero?.[selectedLanguage]?.orderUrl ?? "",
      localizedFields: mapToLocalizedFields(
        selectedConfig?.languages ?? [],
        hero || {},
        ["siteMetaTitle", "siteName"],
      ),
    });
  }, [form, hero, selectedConfig?.languages, selectedLanguage]);

  async function onSubmit(data: PostSectionHeroMutationBody) {
    await uploadHero({
      data: {
        localizedFields: mapToLocalizedFields(
          selectedConfig?.languages ?? [],
          data.localizedFields || {},
          ["siteMetaTitle", "siteName"],
        ),
        orderUrl: data.orderUrl,
      },
      params: { key: selectedDomain },
    });
    if (
      [...Object.keys(deletedAssets), ...Object.keys(uploadedAssets)].length > 0
    ) {
      await uploadHeroAssets({
        params: {
          Key: selectedDomain,
          Language: selectedLanguage,
        },
        data: {
          ...uploadedAssets,
          removedAssets: Object.keys(deletedAssets),
        },
      });
    }
    toast.success("Hero saved.");
    const updated = await refetch();
    setUploadedAssets({});
    setDeletedAssets({});
    form.setValue(
      "Image",
      (updated?.data?.[selectedLanguage]?.heroImage as unknown as Blob) ?? "",
    );
  }

  return (
    <Form {...form}>
      <form
        className="grid max-w-lg gap-4 overflow-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {inputSchema.map((input) => {
          if (input.translate) {
            return (
              <LocalizedFormField key={input.id} name={input.id}>
                {(name) => (
                  <FormField
                    control={form.control}
                    name={`localizedFields.${name}`}
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
                )}
              </LocalizedFormField>
            );
          }

          return (
            <FormField
              key={input.id}
              control={form.control}
              name={input.id}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                      <Input {...field} value={String(field.value)} />
                    </FormControl>
                    <FormMessage />
                    {input.description && (
                      <FormDescription>{input.description}</FormDescription>
                    )}
                  </FormItem>
                );
              }}
            />
          );
        })}
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
                    {(field.value && !deletedAssets?.[field.name]) ||
                    uploadedAssets?.[field.name] ? (
                      <div className="grid gap-2">
                        {input.type === "image" && (
                          <FormImagePreview
                            image={field.value as unknown as string}
                            isStagedDelete={!field.value}
                            file={uploadedAssets[field.name]}
                          />
                        )}
                        <Button
                          className="justify-self-stretch"
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            if (field.value) {
                              setDeletedAssets((state) => ({
                                ...state,
                                [field.name]: true,
                              }));
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
                      <FileInput
                        accept={input.type === "image" ? "image/*" : ""}
                        onFileSelect={(file) => {
                          if (file) {
                            setUploadedAssets((state) => ({
                              ...state,
                              [field.name]: file,
                            }));
                            form.setValue(field.name, file);
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
        <Button type="submit">
          <Save /> Save
        </Button>
      </form>
    </Form>
  );
};

export default hasDomain(Hero);
