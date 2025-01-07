"use client";

import { useDataContext } from "@/components/DataContextProvider";
import FilePreview from "@/components/FilePreview";
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
import { Textarea } from "@/components/ui/textarea";
import {
  PostSectionAboutMutationBody,
  useGetPublicGetCustomerConfig,
  usePostSectionAbout,
} from "@/generated/endpoints";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const inputSchema = [
  {
    id: "Description",
    label: "Description",
    type: "textarea",
  },
] as const;

const assetsInputSchema = [
  {
    id: "Image",
    label: "Image",
    type: "image",
  },
] as const;

const About = () => {
  const { selectedDomain, selectedLanguage } = useDataContext();
  const [uploadedAssets, setUploadedAssets] = useState<Record<string, File>>(
    {},
  );
  const [deletedAssets, setDeletedAssets] = useState<Record<string, boolean>>(
    {},
  );
  const form = useForm<PostSectionAboutMutationBody>({
    defaultValues: {
      Image: "",
      Description: "",
    },
  });

  const { data: customerConfig, refetch } = useGetPublicGetCustomerConfig({
    Key: selectedDomain,
    Language: selectedLanguage,
  });

  const { mutateAsync: uploadAbout } = usePostSectionAbout();

  useEffect(() => {
    if (!customerConfig) return;

    form.reset({
      Image: customerConfig.sections?.about?.image ?? "",
      Description: customerConfig.sections?.about?.description ?? "",
    });
  }, [customerConfig, form]);

  async function onSubmit(data: PostSectionAboutMutationBody) {
    await uploadAbout({
      data: {
        ...uploadedAssets,
        removedAssets: Object.keys(deletedAssets),
        Description: data.Description,
      },
      params: { Key: selectedDomain, Language: selectedLanguage },
    });
    toast.success("About saved.");
    const updated = await refetch();
    setUploadedAssets({});
    setDeletedAssets({});
    form.setValue(
      "Image",
      (updated?.data?.sections?.about?.image as unknown as Blob) ?? "",
    );
  }

  return (
    <Form {...form}>
      <form
        className="grid max-w-lg gap-4 overflow-auto"
        onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
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
                    <Textarea {...field} />
                  </FormControl>
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
                    {(field.value && !deletedAssets?.[field.name]) ||
                    uploadedAssets?.[field.name] ? (
                      <div className="grid justify-start gap-2">
                        {uploadedAssets?.[field.name] ? (
                          <FilePreview file={uploadedAssets[field.name]} />
                        ) : (
                          <>
                            {field.value ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                className="h-32 w-32 rounded bg-gray-100 object-contain"
                                src={field.value as unknown as string}
                                alt=""
                              />
                            ) : (
                              <div className="grid h-32 w-32 place-items-center rounded bg-gray-100 p-2 text-xs text-primary">
                                No image
                              </div>
                            )}
                          </>
                        )}
                        <Button
                          className="block"
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

export default hasDomain(About);
