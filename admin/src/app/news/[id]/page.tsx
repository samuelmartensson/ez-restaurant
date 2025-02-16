"use client";

import ActionBar from "@/components/ActionBar";
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
import { FileInput, Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AddNewsArticleRequest,
  PutSectionNewsIdAssetsBody,
  useGetSectionNewsId,
  usePutSectionNewsId,
  usePutSectionNewsIdAssets,
} from "@/generated/endpoints";
import { mapToLocalizedFields } from "@/utils/mapToLocalizedFields";
import { ChevronLeft, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const inputSchema = [
  {
    id: "title",
    label: "Title",
    type: "text",
    translate: true,
  },
  {
    id: "content",
    label: "Content",
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

const News = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { selectedDomain, selectedLanguage, selectedConfig } = useDataContext();
  const form = useForm<AddNewsArticleRequest & PutSectionNewsIdAssetsBody>({
    defaultValues: {
      published: false,
    },
  });

  const [uploadedAssets, setUploadedAssets] =
    useState<PutSectionNewsIdAssetsBody>({});
  const [deletedAssets, setDeletedAssets] = useState<Record<string, boolean>>(
    {},
  );
  const articleId = Number(params.id);

  const { data: articleData, refetch } = useGetSectionNewsId(articleId, {
    Key: selectedDomain,
    Language: selectedLanguage,
  });

  const { mutateAsync: updateNewsArticle } = usePutSectionNewsId();
  const { mutateAsync: updateNewsArticleAssets } = usePutSectionNewsIdAssets();

  useEffect(() => {
    if (!articleData) return;

    form.reset({
      Image: articleData[selectedLanguage].image ?? "",
      published: articleData[selectedLanguage].published ?? false,
      localizedFields: mapToLocalizedFields(
        selectedConfig?.languages ?? [],
        articleData,
        ["content", "title"],
      ),
    });
  }, [articleData, form, selectedConfig?.languages, selectedLanguage]);

  async function onSubmit(data: AddNewsArticleRequest) {
    const payload = {
      id: articleId,
      params: {
        Key: selectedDomain,
        Language: selectedLanguage,
      },
    };
    await updateNewsArticle({
      ...payload,
      data: {
        localizedFields: mapToLocalizedFields(
          selectedConfig?.languages ?? [],
          data.localizedFields ?? {},
          ["content", "title"],
        ),
        published: data.published ?? false,
        removeImage: Object.keys(deletedAssets).length > 0,
      },
    });
    updateNewsArticleAssets({
      ...payload,
      data: {
        Image: uploadedAssets.Image,
        removedAssets: Object.keys(deletedAssets),
      },
    });
    console.log(deletedAssets);

    await refetch();
    toast.success("Article updated.");
  }

  return (
    <Form {...form}>
      <form
        className="grid max-w-lg gap-4 overflow-auto pb-20"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => {
            return (
              <FormItem className="grid gap-2">
                <FormLabel className="pb-0">Published</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {inputSchema.map((input) => (
          <LocalizedFormField key={input.id} name={input.id}>
            {(name) => (
              <FormField
                control={form.control}
                name={`localizedFields.${name}`}
                render={({ field }) => {
                  let render = <Input {...field} />;

                  if (input.type === "textarea") {
                    render = <Textarea rows={8} {...field} />;
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

        <ActionBar>
          <div className="grid grid-flow-col gap-2">
            <Button
              onClick={() => router.push("/news")}
              variant="secondary"
              type="button"
            >
              <ChevronLeft /> Back
            </Button>
            <Button type="submit">
              <Save /> Save
            </Button>
          </div>
        </ActionBar>
      </form>
    </Form>
  );
};

export default hasDomain(hasSubscription(News));
