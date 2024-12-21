"use client";

import { useFieldArray, useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { Plus, Save, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useDataContext } from "@/components/DataContextProvider";
import FilePreview from "@/components/FilePreview";
import hasDomain from "@/components/hasDomain";
import {
  MenuItem,
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
  const [selectedField, setSelectedField] = useState<InternalMenuItem>();
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Record<string, File>>(
    {}
  );
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const { data = [] } = useGetCustomerGetCustomerMenu({ key: selectedDomain });

  const form = useForm<{ menu: InternalMenuItem[] }>({
    defaultValues: { menu: data },
  });

  const { fields, append, remove } = useFieldArray({
    name: "menu",
    control: form.control,
    keyName: "formId",
  });

  useEffect(() => {
    if (!data) return;
    form.reset({ menu: data });
  }, [data, form]);

  const removeItemsAsync = () => {
    return new Promise<void>((res) => {
      deletedItems.forEach((item) => {
        remove(item);
      });

      res();
    });
  };
  const { mutateAsync: updateMenu } = usePostCustomerUploadCustomerMenu();

  async function onSubmit() {
    await removeItemsAsync();
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

    setUploadedImages({});
  }

  const resolveImageId = (field: MenuItem & { tempId: string }) =>
    field.id === -1 ? field.tempId : (field.id ?? "");

  return (
    <div className="grid grid-rows-[auto_1fr_auto] max-h-screen h-full p-4">
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
      <Form {...form}>
        <Drawer onOpenChange={setIsOpen} open={isOpen}>
          {selectedField && (
            <DrawerContent className="max-w-screen-sm m-auto duration-75">
              <DrawerHeader>
                <DrawerTitle>{selectedField.name}</DrawerTitle>
                <DrawerDescription>
                  {selectedField.description}
                </DrawerDescription>
              </DrawerHeader>
              <div className="overflow-y-auto overscroll-none">
                <div className="grid gap-2 p-4">
                  {inputSchema.map((input) => (
                    <FormField
                      key={input.id}
                      control={form.control}
                      name={`menu.${selectedField.index}.${input.id}` as const}
                      render={({ field }) => {
                        let render = (
                          <Input {...field} value={field.value ?? ""} />
                        );

                        if (input.type === "file") {
                          render =
                            field.value && field.value !== ACTIONS.REMOVE ? (
                              <Button
                                className="block"
                                variant="destructive"
                                type="button"
                                onClick={() => {
                                  if (selectedField.image) {
                                    form.setValue(
                                      `menu.${selectedField.index}.${input.id}` as const,
                                      ACTIONS.REMOVE
                                    );
                                  }
                                  setUploadedImages((state) => {
                                    const newState = { ...state };
                                    delete newState[
                                      resolveImageId(selectedField)
                                    ];

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
              </div>
              <DrawerFooter>
                <Button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  className="mt-10"
                >
                  Done
                </Button>
              </DrawerFooter>
            </DrawerContent>
          )}
        </Drawer>
        <form
          className="grid gap-4 overflow-auto"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="overflow-auto">
            <div className="grid gap-2">
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
                    className="flex justify-between gap-2 border-b pb-2"
                  >
                    <Button
                      onClick={() => {
                        setSelectedField({ ...field, index });
                        setIsOpen(true);
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
                            form.watch(`menu.${index}.image`) !==
                              ACTIONS.REMOVE ? (
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
                    <div className="grid gap-2 justify-items-center">
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
                        size="icon"
                      >
                        {deleteStaged ? <X /> : <Trash />}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2 grid-cols-2 items-end">
            <Button
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
                setSelectedField({ ...item, index: fields.length });
                setIsOpen(true);
              }}
              variant="secondary"
              type="button"
            >
              <Plus /> Menu item
            </Button>
            <Button type="submit">
              <Save /> Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default hasDomain(AdminMenu);
