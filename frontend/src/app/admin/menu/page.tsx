"use client";

import { useForm, useFieldArray } from "react-hook-form";

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
import { CustomerConfig, MenuItem } from "@/types";
import { Plus, Save, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getURL } from "@/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
    type: "text",
  },
  {
    id: "tags",
    label: "Tags",
    type: "text",
  },
] as const;

const AdminMenu = () => {
  const [data, setData] = useState<CustomerConfig["menu"]>([]);
  const [deletedItems, setDeletedItems] = useState<number[]>([]);
  const [selectedField, setSelectedField] = useState<
    CustomerConfig["menu"][number] & { index: number }
  >();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [addCategory, setAddCategory] = useState("");

  const form = useForm<{ menu: MenuItem[] }>({
    defaultValues: { menu: data ?? [] },
  });

  const { fields, append, remove } = useFieldArray({
    name: "menu",
    control: form.control,
  });

  useEffect(() => {
    fetch(getURL("adflow.se", "get-customer-menu"))
      .then((r) => r.json())
      .then((d: CustomerConfig["menu"]) => {
        setData(d);
        setCategories(Array.from(new Set(d.map((m) => m.category))));
        form.reset({ menu: d });
      });
  }, [form]);

  const removeItemsAsync = () => {
    return new Promise<void>((res) => {
      deletedItems.forEach((item) => {
        remove(item);
      });

      res();
    });
  };

  async function onSubmit() {
    await removeItemsAsync();
    setDeletedItems([]);
    const result = await fetch(getURL("adflow.se", "upload-customer-menu"), {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.getValues("menu")),
    }).then((r) => r.json());
    setData(result);
    form.reset({ menu: result });
  }

  return (
    <div>
      <div className="mb-8">
        <div>Categories</div>
        <div className="flex flex-wrap gap-1 mb-2">
          {categories.filter(Boolean).map((c) => (
            <Badge key={c}>{c}</Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Category..."
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
      </div>
      <Form {...form}>
        <Drawer onOpenChange={setIsOpen} open={isOpen}>
          {selectedField && (
            <DrawerContent className="max-w-screen-sm m-auto">
              <DrawerHeader>
                <DrawerTitle>{selectedField.name}</DrawerTitle>
                <DrawerDescription>
                  {selectedField.description}
                </DrawerDescription>
              </DrawerHeader>
              <div className="overflow-y-auto overscroll-none max-h-[60svh]">
                <div className="grid gap-2 p-4">
                  {inputSchema.map((input) => (
                    <FormField
                      key={input.id}
                      control={form.control}
                      name={`menu.${selectedField.index}.${input.id}` as const}
                      render={({ field }) => {
                        let render = <Input {...field} />;

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex justify-between gap-2">
              <Button
                onClick={() => {
                  setSelectedField({ ...field, index });
                  setIsOpen(true);
                }}
                type="button"
                className="block text-left w-full"
                variant="outline"
              >
                {form.watch(`menu.${index}.category`)} -{" "}
                {form.watch(`menu.${index}.name`)} (
                {form.watch(`menu.${index}.price`)})
              </Button>
              <Button
                variant={
                  deletedItems.includes(index) ? "secondary" : "destructive"
                }
                type="button"
                onClick={() =>
                  setDeletedItems((state) =>
                    state.includes(index)
                      ? state.filter((n) => n !== index)
                      : [...state, index]
                  )
                }
                size="icon"
              >
                {deletedItems.includes(index) ? <X /> : <Trash />}
              </Button>
            </div>
          ))}
          <div className="grid gap-2 grid-cols-2">
            <Button
              onClick={() => {
                const item = {
                  category: categories?.[0] ?? "",
                  description: "",
                  image: "",
                  name: "My Dish",
                  price: 0,
                  tags: "",
                };
                append(item);
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

export default AdminMenu;
