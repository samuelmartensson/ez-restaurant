"use client";

import CycleLanguageLabel from "@/components/CycleLanguageLabel";
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
import { FileInput, Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  PutSectionNewsIdBody,
  useGetSectionNewsId,
  usePutSectionNewsId,
} from "@/generated/endpoints";
import { ChevronLeft, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const inputSchema = [
  {
    id: "Title",
    label: "Title",
    type: "text",
    translate: true,
  },
  {
    id: "Content",
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
  const { selectedDomain, selectedLanguage } = useDataContext();
  const form = useForm<PutSectionNewsIdBody>({
    defaultValues: {
      Title: "",
      Content: "",
      Published: false,
    },
  });
  const [uploadedAssets, setUploadedAssets] = useState<Record<string, File>>(
    {},
  );
  const [deletedAssets, setDeletedAssets] = useState<Record<string, boolean>>(
    {},
  );
  const articleId = Number(params.id);

  const { data: articleData, refetch } = useGetSectionNewsId(articleId, {
    Key: selectedDomain,
    Language: selectedLanguage,
  });

  const { mutateAsync: addNewsArticle } = usePutSectionNewsId();

  useEffect(() => {
    if (!articleData) return;

    form.reset({
      Image: articleData.image ?? "",
      Content: articleData?.content ?? "",
      Title: articleData?.title ?? "",
      Published: articleData.published ?? false,
    });
  }, [articleData, form]);

  async function onSubmit(data: PutSectionNewsIdBody) {
    await addNewsArticle({
      id: articleId,
      data: {
        ...uploadedAssets,
        Title: data.Title,
        Content: data.Content,
        Published: data.Published,
      },
      params: { Key: selectedDomain, Language: selectedLanguage },
    });
    await refetch();
    toast.success("Article updated.");
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
              let render = <Input {...field} />;

              if (input.type === "textarea") {
                render = <Textarea rows={8} {...field} />;
              }

              return (
                <FormItem>
                  <FormLabel>
                    {input.translate ? (
                      <CycleLanguageLabel label={input.label} />
                    ) : (
                      input.label
                    )}
                  </FormLabel>
                  <FormControl>{render}</FormControl>
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
        <FormField
          control={form.control}
          name="Published"
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
      </form>
    </Form>
  );
};

export default hasDomain(News);
