"use client";

import { useDataContext } from "@/components/DataContextProvider";
import FilePreview from "@/components/FilePreview";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomerConfig } from "@/types";
import { getURL } from "@/utils";
import { useAuth } from "@clerk/nextjs";
import { Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import hasDomain from "@/components/hasDomain";
import { useGetCustomerGetCustomerConfig } from "@/generated/endpoints";

const inputSchema = [
  {
    id: "SiteName",
    label: "Name",
    type: "text",
  },
  {
    id: "SiteMetaTitle",
    label: "Site meta title",
    type: "text",
  },
  {
    id: "Logo",
    label: "Logo",
    type: "file",
  },
  {
    id: "Adress",
    label: "Adress",
    type: "text",
  },
  {
    id: "Phone",
    label: "Phone",
    type: "text",
  },
  {
    id: "Email",
    label: "Email",
    type: "text",
  },
  {
    id: "Theme",
    label: "Theme",
    type: "select",
  },
] as const;

interface UpdateSiteConfigurationRequest {
  SiteName: string;
  SiteMetaTitle: string;
  Logo: string;
  Theme: string;
  Adress?: string;
  Phone?: string;
  Email?: string;
}

const THEMES = ["modern", "rustic"];

const ACTIONS = {
  REMOVE: "REMOVE",
};

const Site = () => {
  const { selectedDomain } = useDataContext();
  const { getToken } = useAuth();
  const [uploadedImages, setUploadedImages] = useState<Record<string, File>>(
    {}
  );
  const form = useForm<UpdateSiteConfigurationRequest>({
    defaultValues: {
      SiteName: "",
      SiteMetaTitle: "",
      Logo: "",
      Theme: "",
      Adress: "",
      Phone: "",
      Email: "",
    },
  });

  const { data } = useGetCustomerGetCustomerConfig({ key: selectedDomain });

  useEffect(() => {
    if (!data?.config) return;

    form.reset({
      SiteName: data.config.siteName ?? "",
      SiteMetaTitle: data.config.siteMetaTitle ?? "",
      Logo: data.config.logo ?? "",
      Theme: data.config.theme ?? "",
      Adress: data.config.adress ?? "",
      Phone: data.config.phone ?? "",
      Email: data.config.email ?? "",
    });
  }, [data, form]);

  const fetchCustomerConfig = useCallback(async () => {
    return fetch(getURL(selectedDomain, "get-customer-config"))
      .then((r) => r.json())
      .then((d: CustomerConfig) => {
        const { config } = d;
        form.reset({
          SiteName: config.siteName,
          SiteMetaTitle: config.siteMetaTitle,
          Logo: config.logo,
          Theme: config.theme,
          Adress: config.adress,
          Phone: config.phone,
          Email: config.email,
        });
      });
  }, [form, selectedDomain]);

  async function onSubmit(data: UpdateSiteConfigurationRequest) {
    const formData = new FormData();
    formData.append(
      "siteConfigurationJson",
      JSON.stringify({
        ...data,
        Logo: data.Logo === ACTIONS.REMOVE ? ACTIONS.REMOVE : "",
      })
    );
    formData.append("logo", uploadedImages?.Logo);

    await fetch(getURL(selectedDomain, "upload-site-configuration"), {
      method: "post",
      body: formData,
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    }).then((r) => r.json());

    await fetchCustomerConfig();
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4 overflow-auto p-4"
        onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
      >
        {inputSchema.map((input) => (
          <FormField
            key={input.id}
            control={form.control}
            name={input.id}
            render={({ field }) => {
              let render = <Input {...field} />;

              if (input.type === "file") {
                render =
                  field.value && field.value !== ACTIONS.REMOVE ? (
                    <div className="grid gap-2 justify-start">
                      {uploadedImages?.[field.name] ? (
                        <FilePreview file={uploadedImages[field.name]} />
                      ) : (
                        <>
                          {field.value &&
                          form.watch(field.name) !== ACTIONS.REMOVE ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              className="h-20 w-20 object-contain bg-gray-100 rounded"
                              src={field.value}
                              alt=""
                            />
                          ) : (
                            <div className="grid place-items-center p-2 text-xs h-20 w-20 bg-gray-100 rounded text-primary">
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
                            form.setValue(field.name, ACTIONS.REMOVE);
                          }
                          setUploadedImages((state) => {
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
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setUploadedImages((state) => ({
                            ...state,
                            [field.name]: file,
                          }));
                          form.setValue(field.name, file as unknown as string);
                        }
                      }}
                    />
                  );
              }

              if (input.type === "select") {
                render = (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{input.label}</SelectLabel>
                        {THEMES.filter(Boolean).map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                );
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
        ))}
        <Button type="submit">
          <Save /> Save
        </Button>
      </form>
    </Form>
  );
};

export default hasDomain(Site);
