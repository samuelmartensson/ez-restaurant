"use client";

import { useDataContext } from "@/components/DataContextProvider";
import hasDomain from "@/components/hasDomain";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PostSectionNewsMutationBody,
  useGetSectionNews,
  usePostSectionNews,
} from "@/generated/endpoints";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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

const News = () => {
  const router = useRouter();
  const { selectedDomain, selectedLanguage } = useDataContext();
  const form = useForm<PostSectionNewsMutationBody>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const { data, refetch } = useGetSectionNews({
    Key: selectedDomain,
    Language: selectedLanguage,
  });

  const { mutateAsync: addNewsArticle } = usePostSectionNews();

  async function onSubmit(data: PostSectionNewsMutationBody) {
    await addNewsArticle({
      data,
      params: { Key: selectedDomain, Language: selectedLanguage },
    });
    await refetch();
    toast.success("Article added.");
    form.reset({});
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="fixed inset-x-6 bottom-4 md:left-[--sidebar-width] md:ml-6"
            type="button"
          >
            <Plus /> Add new article
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>News article</DialogTitle>
            <DialogDescription>Add a new article</DialogDescription>
          </DialogHeader>

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
                        <FormLabel>{input.label}</FormLabel>
                        <FormControl>{render}</FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ))}
              <DialogFooter>
                <Button>
                  <Plus /> Add
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="grid gap-2">
        {data?.map((d) => (
          <div
            onClick={() => router.push(`/news/${String(d.id)}`)}
            className="flex cursor-pointer items-center justify-between gap-2 rounded border border-input p-4"
            key={d.id}
          >
            <div className="grid w-full">
              <div className="mb-2 flex w-full gap-2">
                <span className="text-lg">{d.title}</span>
                {d.published && <Badge className="ml-auto">Published</Badge>}
              </div>
              <span className="text-xs text-muted-foreground">
                Updated: {new Date(d.updatedAt!).toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">
                Created: {new Date(d.date!).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default hasDomain(News);
