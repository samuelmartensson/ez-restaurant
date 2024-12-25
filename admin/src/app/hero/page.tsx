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
import {
  PostCustomerUploadHeroMutationBody,
  useGetPublicGetCustomerConfig,
  usePostCustomerUploadHero,
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
  },
] as const;

const assetsInputSchema = [
  {
    id: "Image",
    label: "Hero image",
    type: "image",
  },
] as const;

const Hero = () => {
  const { selectedDomain } = useDataContext();
  const [uploadedAssets, setUploadedAssets] = useState<Record<string, File>>(
    {}
  );
  const [deletedAssets, setDeletedAssets] = useState<Record<string, boolean>>(
    {}
  );
  const form = useForm<PostCustomerUploadHeroMutationBody>({
    defaultValues: {
      Image: "",
      OrderUrl: "",
    },
  });

  const { data: customerConfig, refetch } = useGetPublicGetCustomerConfig({
    key: selectedDomain,
  });

  const { mutateAsync: uploadHero } = usePostCustomerUploadHero();

  useEffect(() => {
    if (!customerConfig) return;

    form.reset({
      Image: customerConfig.sections?.hero?.heroImage ?? "",
      OrderUrl: customerConfig.sections?.hero?.orderUrl ?? "",
    });
  }, [customerConfig, form]);

  async function onSubmit(data: PostCustomerUploadHeroMutationBody) {
    await uploadHero({
      data: {
        ...uploadedAssets,
        removedAssets: Object.keys(deletedAssets),
        OrderUrl: data.OrderUrl,
      },
      params: { key: selectedDomain },
    });
    toast("Hero saved.");
    refetch();
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4 overflow-auto p-4 max-w-lg"
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
                    <Input {...field} />
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
                    {field.value && !deletedAssets?.[field.name] ? (
                      <div className="grid gap-2 justify-start">
                        {input.type === "image" && (
                          <>
                            {uploadedAssets?.[field.name] ? (
                              <FilePreview file={uploadedAssets[field.name]} />
                            ) : (
                              <>
                                {field.value ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    className="h-20 w-20 object-contain bg-gray-100 rounded"
                                    src={field.value as unknown as string}
                                    alt=""
                                  />
                                ) : (
                                  <div className="grid place-items-center p-2 text-xs h-20 w-20 bg-gray-100 rounded text-primary">
                                    No image
                                  </div>
                                )}
                              </>
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

export default hasDomain(Hero);
