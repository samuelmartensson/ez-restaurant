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
import MenuCategories from "@/components/MenuCategories";
import {
  MenuResponse,
  useGetCustomerGetCustomerMenu,
  usePostMenuCategory,
  usePostMenuItems,
} from "@/generated/endpoints";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const ACTIONS = {
  REMOVE: "REMOVE",
};

const menuItemSchema = z.object({
  categoryId: z.union([z.string(), z.number()]),
  id: z.number(),
  name: z.string().min(1),
  price: z.number(),
  index: z.number(),
  tempId: z.string().optional(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
});
const formSchema = z.object({
  menu: z.array(menuItemSchema),
});

const inputSchema = [
  {
    id: "name",
    label: "Name",
    type: "text",
  },
  {
    id: "categoryId",
    label: "Category",
    type: "select",
  },
  {
    id: "price",
    label: "Price",
    type: "number",
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

const DataLayer = () => {
  const { selectedDomain } = useDataContext();

  const { data = { categories: [], menuItems: [] }, isLoading } =
    useGetCustomerGetCustomerMenu({
      key: selectedDomain,
    });

  if (isLoading) return <></>;

  return <AdminMenu data={data} />;
};

const AdminMenu = ({ data }: { data: MenuResponse }) => {
  const { selectedDomain } = useDataContext();
  const [deletedItems, setDeletedItems] = useState<number[]>([]);
  const [selectedFieldIndex, setSelectedField] = useState<number>();
  const [uploadedImages, setUploadedImages] = useState<Record<string, File>>(
    {}
  );

  const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  const [addCategory, setAddCategory] = useState("");
  const { refetch } = useGetCustomerGetCustomerMenu({
    key: selectedDomain,
  });

  const categoryList = data.categories;
  const categories = Object.fromEntries(
    categoryList.map((item) => [item.id, item.name])
  );
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { menu: data.menuItems },
    mode: "onChange",
    resolver: zodResolver(formSchema),
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
    form.reset({ menu: data.menuItems?.map((d, i) => ({ ...d, index: i })) });
  }, [data, form]);

  const { mutateAsync: updateMenu, isPending } = usePostMenuItems();
  const { mutateAsync: updateCategory } = usePostMenuCategory();

  const handleUpdateCategory = async () => {
    if (!addCategory.trim()) return;
    await updateCategory({
      data: { id: selectedCategory, name: addCategory },
      params: { key: selectedDomain },
    });
    if (selectedCategory === -1) {
      setAddCategory("");
    }
    refetch();
  };

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
            categoryId: Number(d.categoryId),
          }))
        ),
        files: Object.entries(uploadedImages).map(
          ([key, value]) => new File([value], key)
        ),
      },
    });
    await refetch();
    toast("Updated menu.");
    setUploadedImages({});
  }

  const handleAddMenuItem = () => {
    append({
      categoryId:
        selectedCategory !== -1 ? selectedCategory : categoryList[0].id,
      description: "",
      image: "",
      name: "My Dish",
      price: 0,
      tags: "",
      tempId: uuidv4(),
      id: -1,
      index: fields.length,
    });
    setSelectedField(fields.length);
  };

  const resolveImageId = (field?: z.infer<typeof menuItemSchema>) =>
    field?.id === -1 ? (field?.tempId ?? "") : (field?.id ?? "");

  return (
    <div className="grid p-4 gap-4" style={{ gridTemplateColumns: "3fr 2fr" }}>
      <div className="grid grid-rows-[auto_70vh]">
        <MenuCategories
          category={addCategory}
          setCategory={setAddCategory}
          items={categoryList}
          onClick={handleUpdateCategory}
          btnLabel={
            selectedCategory !== -1 ? "Update category" : "Add category"
          }
          selectedCategory={selectedCategory}
          onBadgeClick={(payload) => {
            setSelectedCategory(payload.isSelected ? -1 : payload.id);
            setAddCategory(payload.isSelected ? "" : payload.name);
          }}
          setSelectedCategory={setSelectedCategory}
        />
        <div className="flex flex-col gap-2 overflow-auto p-2">
          {fields.map((field, index) => {
            const deleteStaged = deletedItems.includes(index);
            const saveStaged = !data?.menuItems
              ?.map((d) => d.id)
              .includes(field.id);

            if (
              selectedCategory !== -1 &&
              form.watch(`menu.${index}.categoryId`)?.toString() !==
                selectedCategory.toString()
            )
              return null;

            return (
              <div
                key={field.formId}
                className={`relative flex justify-between gap-2 border-b ${selectedField?.index === field.index ? "border-l-4 border-l-primary" : ""}`}
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
                      <Badge>
                        {categories[form.watch(`menu.${index}.categoryId`)]}
                      </Badge>
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
          <Button onClick={handleAddMenuItem} variant="secondary" type="button">
            <Plus /> Menu item
          </Button>
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
              onClick={handleAddMenuItem}
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

                    if (input.type === "number") {
                      render = (
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          type={input.type}
                        />
                      );
                    }

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
                              {categoryList.filter(Boolean).map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>
                                  {c.name}
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

export default hasDomain(DataLayer);
