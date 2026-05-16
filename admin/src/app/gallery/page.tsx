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
import { Control, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

type GalleryFormValues = { gallery: SiteSectionGalleryResponse[] };

type GalleryItemProps = {
  item: SiteSectionGalleryResponse & { formId: string };
  index: number;
  control: Control<GalleryFormValues>;
  remove: (index?: number) => void;
  uploadedAssets: Record<number | string, File>;
  setUploadedAssets: React.Dispatch<
    React.SetStateAction<Record<number | string, File>>
  >;
  selectedDomain: string;
  selectedLanguage: string;
  refetch: () => void;
  onFileSelect: (files: File[] | null, index: number) => void;
};

const GalleryItem = ({
  item,
  index,
  control,
  remove,
  uploadedAssets,
  setUploadedAssets,
  selectedDomain,
  selectedLanguage,
  refetch,
  onFileSelect,
}: GalleryItemProps) => {
  const { mutateAsync: deleteImage, isPending: isDeleting } =
    useDeleteGallery();

  return (
    <FormField
      key={item.formId}
      control={control}
      name={`gallery.${index}.image`}
      render={({ field }) => {
        const imageId = item.id ?? -1;
        return (
          <FormItem>
            <FormControl>
              {field.value || uploadedAssets?.[imageId] ? (
                <div className="grid gap-2">
                  <FormImagePreview
                    image={field.value as unknown as string}
                    isStagedDelete={!field.value}
                    file={
                      uploadedAssets[imageId] || uploadedAssets[field.name]
                    }
                  />
                  <Button
                    className="block"
                    variant="destructive"
                    size="sm"
                    type="button"
                    disabled={isDeleting}
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
                  onFileSelect={(files) => onFileSelect(files, index)}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

const Gallery = () => {
  const { selectedDomain, selectedLanguage } = useDataContext();
  const [uploadedAssets, setUploadedAssets] = useState<
    Record<number | string, File>
  >({});
  const form = useForm<GalleryFormValues>({
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

  const handleFileSelect = async (files: File[] | null, index: number) => {
    if (files) {
      await uploadImages({
        data: { Images: files },
        params: { Key: selectedDomain, Language: selectedLanguage },
      });
      refetch();
      toast.success("Upload completed.");
    } else {
      remove(index);
    }
  };

  return (
    <Form {...form}>
      <form className="grid gap-8 pb-16">
        <div className="grid max-w-lg grid-cols-2 gap-4 md:grid-cols-3">
          {fields.map((item, index) => (
            <GalleryItem
              key={item.formId}
              item={item}
              index={index}
              control={form.control}
              remove={remove}
              uploadedAssets={uploadedAssets}
              setUploadedAssets={setUploadedAssets}
              selectedDomain={selectedDomain}
              selectedLanguage={selectedLanguage}
              refetch={refetch}
              onFileSelect={handleFileSelect}
            />
          ))}
        </div>

        <Button
          className="max-w-lg"
          type="button"
          disabled={isPendingUpload}
          onClick={() => append({ image: "" as unknown as string, id: -1 })}
        >
          <Upload /> Upload Image(s)
        </Button>
      </form>
    </Form>
  );
};

export default hasDomain(hasSubscription(Gallery));
