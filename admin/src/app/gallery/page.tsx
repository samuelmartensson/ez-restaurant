"use client";

import { useDataContext } from "@/components/DataContextProvider";
import FormImagePreview from "@/components/FormImagePreview";
import hasDomain from "@/components/hasDomain";
import hasSubscription from "@/components/hasSubscription";
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
  useDeleteGallery,
  useGetPublicGetCustomerConfig,
  usePostGallery,
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
    cache: false,
  });

  const { mutateAsync: uploadImages, isPending: isPendingUpload } =
    usePostGallery();
  const { mutateAsync: deleteImage, isPending: isPendingDelete } =
    useDeleteGallery();

  const isPending = isPendingUpload || isPendingDelete;

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
      <form className="grid gap-8 pb-16">
        <div className="grid max-w-lg grid-cols-2 gap-4 md:grid-cols-3">
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
                            size="sm"
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
                              toast.success("Upload completed.");
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
        </div>

        <Button
          className="fixed inset-x-6 bottom-4 max-w-lg md:left-[--sidebar-width] md:ml-6"
          type="button"
          disabled={isPending}
          onClick={() => append({ image: "" as unknown as string, id: -1 })}
        >
          <Upload /> Upload Image(s)
        </Button>
      </form>
    </Form>
  );
};

export default hasDomain(hasSubscription(Gallery));
