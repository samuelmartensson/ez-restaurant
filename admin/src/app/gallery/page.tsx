"use client";

import { useDataContext } from "@/components/DataContextProvider";
import FormImagePreview from "@/components/FormImagePreview";
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
import { FileInput } from "@/components/ui/input";
import {
  SiteSectionGalleryResponse,
  useDeleteSectionGallery,
  useGetPublicGetCustomerConfig,
  usePostSectionGallery,
} from "@/generated/endpoints";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

const Gallery = () => {
  const { selectedDomain, selectedLanguage } = useDataContext();
  const [uploadedAssets, setUploadedAssets] = useState<
    Record<number | string, File>
  >({});
  const form = useForm<{ gallery: SiteSectionGalleryResponse[] }>({
    defaultValues: {
      gallery: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "gallery",
    control: form.control,
    keyName: "formId",
  });

  const { data: customerConfig, refetch } = useGetPublicGetCustomerConfig({
    Key: selectedDomain,
    Language: selectedLanguage,
  });

  const { mutateAsync: uploadImages } = usePostSectionGallery();
  const { mutateAsync: deleteImage } = useDeleteSectionGallery();

  useEffect(() => {
    if (!customerConfig) return;

    form.reset({
      gallery:
        customerConfig.sections?.gallery?.map((g) => ({
          image: g.image ?? "",
          id: g.id,
        })) ?? [],
    });
  }, [customerConfig, form]);

  return (
    <Form {...form}>
      <form className="grid max-w-lg gap-4 overflow-auto">
        {fields.map((item, index) => (
          <FormField
            key={item.formId}
            control={form.control}
            name={`gallery.${index}.image`}
            render={({ field }) => {
              const imageId = item.id ?? -1;
              return (
                <FormItem>
                  <FormLabel>Image {index + 1}</FormLabel>
                  <FormControl>
                    {field.value || uploadedAssets?.[imageId] ? (
                      <div className="grid gap-2">
                        <FormImagePreview
                          image={field.value as unknown as string}
                          isStagedDelete={!field.value}
                          file={
                            uploadedAssets[imageId] ||
                            uploadedAssets[field.name]
                          }
                        />
                        <Button
                          className="block"
                          variant="destructive"
                          type="button"
                          onClick={async () => {
                            if (field.value && imageId !== -1) {
                              await deleteImage({
                                params: {
                                  Key: selectedDomain,
                                  Language: selectedLanguage,
                                  id: item.id,
                                },
                              });

                              refetch();
                              toast.success("Image deleted.");
                            }
                            setUploadedAssets((state) => {
                              const newState = { ...state };
                              delete newState[imageId];

                              return newState;
                            });
                            remove(index);
                          }}
                        >
                          Remove file
                        </Button>
                      </div>
                    ) : (
                      <FileInput
                        triggerOnMount
                        accept="image/*"
                        multiple
                        onFileSelect={async (files) => {
                          if (files) {
                            await uploadImages({
                              data: {
                                Images: files,
                              },
                              params: {
                                Key: selectedDomain,
                                Language: selectedLanguage,
                              },
                            });
                            refetch();
                            toast.success("Images uploaded.");
                          } else {
                            remove(index);
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

        <Button
          type="button"
          onClick={() => append({ image: "" as unknown as string, id: -1 })}
        >
          <Upload /> Upload Image(s)
        </Button>
      </form>
    </Form>
  );
};

export default hasDomain(Gallery);
