"use client";

import { useDataContext } from "@/components/DataContextProvider";
import FormImagePreview from "@/components/FormImagePreview";
import hasDomain from "@/components/hasDomain";
import hasSubscription from "@/components/hasSubscription";
import LocalizedFormField from "@/components/LocalizedFormField";
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
import { Textarea } from "@/components/ui/textarea";
import {
  PostAboutAssetsBody,
  PostAboutMutationBody,
  useGetAbout,
  usePostAbout,
  usePostAboutAssets,
} from "@/generated/endpoints";
import { mapToLocalizedFields } from "@/utils/mapToLocalizedFields";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const inputSchema = [
  {
    id: "description",
    label: "Description",
    type: "textarea",
    translate: true,
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
  const { selectedDomain, selectedLanguage, selectedConfig } = useDataContext();
  const [uploadedAssets, setUploadedAssets] = useState<PostAboutAssetsBody>({});
  const [deletedAssets, setDeletedAssets] = useState<Record<string, boolean>>(
    {},
  );
  const form = useForm<PostAboutMutationBody & PostAboutAssetsBody>();

  const { data: aboutSection, refetch } = useGetAbout({
    Key: selectedDomain,
    Language: selectedLanguage,
  });
  const { mutateAsync: uploadAbout } = usePostAbout();
  const { mutateAsync: uploadAboutAssets } = usePostAboutAssets();

  useEffect(() => {
    if (!aboutSection) return;

    form.reset({
      Image: aboutSection?.[selectedLanguage].image ?? "",
      localizedFields: mapToLocalizedFields(
        selectedConfig?.languages ?? [],
        aboutSection || {},
        ["description"],
      ),
    });
  }, [aboutSection, form, selectedConfig?.languages, selectedLanguage]);

  async function onSubmit(data: PostAboutMutationBody) {
    await uploadAbout({
      data: {
        localizedFields: mapToLocalizedFields(
          selectedConfig?.languages ?? [],
          data.localizedFields ?? {},
          ["description"],
        ),
      },
      params: { Key: selectedDomain, Language: selectedLanguage },
    });
    if (
      [...Object.keys(deletedAssets), ...Object.keys(uploadedAssets)].length > 0
    ) {
      await uploadAboutAssets({
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
    toast.success("About saved.");
    const updated = await refetch();
    setUploadedAssets({});
    setDeletedAssets({});
    form.setValue(
      "Image",
      (updated?.data?.[selectedLanguage].image as unknown as Blob) ?? "",
    );
  }

  return (
    <Form {...form}>
      <form
        className="grid max-w-lg gap-4 overflow-auto"
        onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
      >
        {inputSchema.map((input) => (
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
                        <Textarea
                          rows={8}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}
          </LocalizedFormField>
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
                        <FormImagePreview
                          image={field.value as unknown as string}
                          isStagedDelete={!field.value}
                          file={uploadedAssets[field.name]}
                        />
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

export default hasDomain(hasSubscription(About));
