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
  useDeleteSectionNewsId,
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
import { Pen, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ActionBar from "@/components/ActionBar";
import { useState } from "react";
import LocalizedFormField from "@/components/LocalizedFormField";
import hasSubscription from "@/components/hasSubscription";

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
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(-1);
  const { selectedDomain, selectedLanguage } = useDataContext();
  const form = useForm<PostSectionNewsMutationBody>();

  const { data, refetch } = useGetSectionNews({
    Key: selectedDomain,
    Language: selectedLanguage,
  });

  const { mutateAsync: addNewsArticle } = usePostSectionNews();
  const { mutateAsync: deleteNewsArticle } = useDeleteSectionNewsId();

  async function onSubmit(data: PostSectionNewsMutationBody) {
    await addNewsArticle({
      data,
      params: { Key: selectedDomain, Language: selectedLanguage },
    });
    await refetch();
    toast.success("Article added.");
    form.reset({});
    setIsAddOpen(false);
  }

  async function onDelete(id: number) {
    await deleteNewsArticle({
      id,
      params: { Key: selectedDomain, Language: selectedLanguage },
    });
    await refetch();
    toast.success("Article removed.");
    setDeleteId(-1);
  }

  return (
    <div className="max-w-lg pb-16">
      <Dialog
        open={deleteId !== -1}
        onOpenChange={(open) => !open && setDeleteId(-1)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              <span className="font-bold">
                {data?.find((d) => d.id === deleteId)?.title}
              </span>{" "}
              article.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                onDelete(data?.find((d) => d.id === deleteId)?.id ?? -1);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ActionBar>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed inset-x-6 bottom-4 max-w-lg md:left-[--sidebar-width] md:ml-6"
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
                  <LocalizedFormField name={input.id} key={input.id}>
                    {(name) => (
                      <FormField
                        key={input.id}
                        control={form.control}
                        name={`localizedFields.${name}`}
                        render={({ field }) => {
                          let render = (
                            <Input {...field} value={field.value ?? ""} />
                          );

                          if (input.type === "textarea") {
                            render = (
                              <Textarea
                                rows={8}
                                {...field}
                                value={field.value ?? ""}
                              />
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
                    )}
                  </LocalizedFormField>
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
      </ActionBar>

      <div className="grid gap-2">
        {data?.map((d) => (
          <div
            className="flex items-center justify-between gap-2 rounded-xl border border-input p-6 shadow"
            key={d.id}
          >
            <div className="grid">
              <div className="mb-2 flex flex-col items-start gap-2">
                {d.published && <Badge>Published</Badge>}
                <span className="text-lg">{d.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Updated: {new Date(d.updatedAt!).toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">
                Created: {new Date(d.date!).toLocaleString()}
              </span>
            </div>
            <div className="grid gap-2 self-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  router.push(`/news/${String(d.id)}`);
                }}
              >
                <Pen />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteId(d.id ?? -1)}
              >
                <Trash />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default hasDomain(hasSubscription(News));
