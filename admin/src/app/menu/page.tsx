"use client";

import { useFieldArray, useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
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
import { Copy, Plus, Save, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useDataContext } from "@/components/DataContextProvider";
import FilePreview from "@/components/FilePreview";
import hasDomain from "@/components/hasDomain";
import {
  MenuResponse,
  useGetCustomerGetCustomerMenu,
  usePostCustomerUploadCustomerMenu,
} from "@/generated/endpoints";
import { v4 as uuidv4 } from "uuid";

const ACTIONS = {
  REMOVE: "REMOVE",
};

const inputSchema = [
  {
    id: "name",
    label: "Name",
    type: "text",
  },
  {
    id: "category",
    label: "Category",
    type: "select",
  },
  {
    id: "price",
    label: "Price",
    type: "text",
  },
  {
    id: "description",
    label: "Description",
    type: "text",
  },
  {
    id: "image",
    label: "Image",
    type: "file",
  },
  {
    id: "tags",
    label: "Tags",
    type: "text",
  },
] as const;

type InternalMenuItem = MenuResponse & {
  index: number;
  tempId: string;
};

const AdminMenu = () => {
  const { selectedDomain } = useDataContext();
  const [deletedItems, setDeletedItems] = useState<number[]>([]);
  const [selectedFieldIndex, setSelectedField] = useState<number>();
  const [uploadedImages, setUploadedImages] = useState<Record<string, File>>(
    {}
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const { data = [], refetch } = useGetCustomerGetCustomerMenu({
    key: selectedDomain,
  });

  const form = useForm<{ menu: InternalMenuItem[] }>({
    defaultValues: { menu: data },
  });

  const { fields, append, remove } = useFieldArray({
    name: "menu",
    control: form.control,
    keyName: "formId",
  });

  const selectedField =
    selectedFieldIndex !== undefined ? fields[selectedFieldIndex] : undefined;

  useEffect(() => {
    if (!data) return;
    form.reset({ menu: data.map((d, i) => ({ ...d, index: i })) });
    setCategories(Array.from(new Set(data.map((m) => m.category ?? ""))));
  }, [data, form]);

  const { mutateAsync: updateMenu, isPending } =
    usePostCustomerUploadCustomerMenu();

  async function onSubmit() {
    remove(deletedItems);
    setDeletedItems([]);

    await updateMenu({
      params: { key: selectedDomain },
      data: {
        menuItemsJson: JSON.stringify(
          form.getValues("menu").map((d) => ({
            ...d,
            image: d.image === ACTIONS.REMOVE ? ACTIONS.REMOVE : "",
            price: Number(d.price),
          }))
        ),
        files: Object.entries(uploadedImages).map(
          ([key, value]) => new File([value], key)
        ),
      },
    });
    await refetch();

    setUploadedImages({});
  }

  const resolveImageId = (field: MenuResponse & { tempId: string }) =>
    field.id === -1 ? field.tempId : (field.id ?? "");

  return (
    <div className="grid p-4 gap-4" style={{ gridTemplateColumns: "3fr 2fr" }}>
      <div className="grid grid-rows-[auto_70vh]">
        <div className="mb-8">
          <div className="text-xl mb-2">Categories</div>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add category..."
              value={addCategory}
              onChange={(e) => setAddCategory(e.target.value)}
            />
            <Button
              onClick={() => {
                setCategories((state) =>
                  Array.from(new Set([...state, addCategory]))
                );
                setAddCategory("");
              }}
            >
              Add category
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.filter(Boolean).map((c) => (
              <Badge
                variant={selectedCategory === c ? "default" : "outline"}
                onClick={() =>
                  setSelectedCategory(selectedCategory === c ? "" : c)
                }
                className="text-base cursor-pointer"
                key={c}
              >
                {c}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 overflow-auto p-2">
          {fields.map((field, index) => {
            const deleteStaged = deletedItems.includes(index);
            const saveStaged = !data.map((d) => d.id).includes(field.id);

            if (
              selectedCategory &&
              form.watch(`menu.${index}.category`) !== selectedCategory
            )
              return null;

            return (
              <div
                key={field.formId}
                className={`relative flex justify-between gap-2 border-b ${selectedField?.id === field.id ? "border-l-4 border-l-primary" : ""}`}
              >
                <Button
                  onClick={() => {
                    setSelectedField(index);
                  }}
                  type="button"
                  className="block text-left w-full h-auto"
                  variant={(() => {
                    if (saveStaged) return "default";
                    return deleteStaged ? "destructive" : "ghost";
                  })()}
                >
                  <div className="flex gap-2 items-center">
                    {uploadedImages?.[resolveImageId(field)] ? (
                      <FilePreview
                        file={uploadedImages[resolveImageId(field)]}
                      />
                    ) : (
                      <>
                        {field.image &&
                        form.watch(`menu.${index}.image`) !== ACTIONS.REMOVE ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            className="h-20 w-20 object-contain bg-gray-100 rounded"
                            src={field.image}
                            alt=""
                          />
                        ) : (
                          <div className="grid place-items-center p-2 text-xs h-20 w-20 bg-gray-100 rounded text-primary">
                            No image
                          </div>
                        )}
                      </>
                    )}
                    <div className="grid gap-1 justify-items-start">
                      <span className="text-base">
                        {form.watch(`menu.${index}.name`)}
                      </span>
                      <Badge>{form.watch(`menu.${index}.category`)}</Badge>
                    </div>
                  </div>
                </Button>
                <div className="grid gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      if (saveStaged) {
                        remove(index);
                        return;
                      }
                      setDeletedItems((state) =>
                        state.includes(index)
                          ? state.filter((n) => n !== index)
                          : [...state, index]
                      );
                    }}
                  >
                    {deleteStaged ? <X /> : <Trash />} Delete
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      const item = {
                        ...field,
                        tempId: uuidv4(),
                        id: -1,
                      };
                      append({ ...item, index: fields.length });
                      setSelectedField(fields.length);
                    }}
                  >
                    <Copy /> Copy
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-l px-4">
        <form
          className="grid gap-4 overflow-auto"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex gap-2 flex-wrap">
            <Button
              className="flex-1"
              onClick={() => {
                const item = {
                  category: categories?.[0] ?? "",
                  description: "",
                  image: "",
                  name: "My Dish",
                  price: 0,
                  tags: "",
                  tempId: uuidv4(),
                  id: -1,
                };

                append({ ...item, index: fields.length });
                setSelectedField(fields.length);
              }}
              variant="secondary"
              type="button"
            >
              <Plus /> Menu item
            </Button>
            <Button disabled={isPending} className="flex-1" type="submit">
              <Save /> Save
            </Button>
          </div>
        </form>
        <Form {...form}>
          {selectedField && (
            <div className="grid gap-2 p-4" key={selectedFieldIndex}>
              {inputSchema.map((input) => (
                <FormField
                  key={input.id}
                  control={form.control}
                  name={`menu.${selectedField.index}.${input.id}` as const}
                  render={({ field }) => {
                    let render = <Input {...field} value={field.value ?? ""} />;

                    if (input.type === "file") {
                      render =
                        field.value && field.value !== ACTIONS.REMOVE ? (
                          <Button
                            className="block"
                            variant="destructive"
                            type="button"
                            onClick={() => {
                              form.setValue(
                                `menu.${selectedField.index}.${input.id}` as const,
                                selectedField.image ? ACTIONS.REMOVE : ""
                              );

                              setUploadedImages((state) => {
                                const newState = { ...state };
                                delete newState[resolveImageId(selectedField)];

                                return newState;
                              });
                            }}
                          >
                            Remove file
                          </Button>
                        ) : (
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                setUploadedImages((state) => ({
                                  ...state,
                                  [resolveImageId(selectedField)]: file,
                                }));
                                form.setValue(
                                  `menu.${selectedField.index}.${input.id}` as const,
                                  file as unknown as string
                                );
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
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>{input.label}</SelectLabel>
                              {categories.filter(Boolean).map((c) => (
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
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default hasDomain(AdminMenu);
