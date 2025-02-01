"use client";

import { useDataContext } from "@/components/DataContextProvider";
import FormImagePreview from "@/components/FormImagePreview";
import hasDomain from "@/components/hasDomain";
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
  PostSectionHeroMutationBody,
  useGetPublicGetCustomerConfig,
  usePostSectionHero,
} from "@/generated/endpoints";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const inputSchema = [
  {
    id: "OrderUrl",
    label: "Order now URL",
    type: "text",
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
  const { selectedDomain, selectedLanguage } = useDataContext();
  const [uploadedAssets, setUploadedAssets] = useState<Record<string, File>>(
    {},
  );
  const [deletedAssets, setDeletedAssets] = useState<Record<string, boolean>>(
    {},
  );
  const form = useForm<PostSectionHeroMutationBody>({
    defaultValues: {
      Image: "",
      OrderUrl: "",
    },
  });

  const { data: customerConfig, refetch } = useGetPublicGetCustomerConfig({
    Key: selectedDomain,
    Language: selectedLanguage,
  });

  const { mutateAsync: uploadHero } = usePostSectionHero();

  useEffect(() => {
    if (!customerConfig) return;

    form.reset({
      Image: customerConfig.sections?.hero?.heroImage ?? "",
      OrderUrl: customerConfig.sections?.hero?.orderUrl ?? "",
    });
  }, [customerConfig, form]);

  async function onSubmit(data: PostSectionHeroMutationBody) {
    await uploadHero({
      data: {
        ...uploadedAssets,
        removedAssets: Object.keys(deletedAssets),
        OrderUrl: data.OrderUrl,
      },
      params: { key: selectedDomain },
    });
    toast.success("Hero saved.");
    const updated = await refetch();
    setUploadedAssets({});
    setDeletedAssets({});
    form.setValue(
      "Image",
      (updated?.data?.sections?.hero?.heroImage as unknown as Blob) ?? "",
    );
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
                  {input.description && (
                    <FormDescription>{input.description}</FormDescription>
                  )}
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
