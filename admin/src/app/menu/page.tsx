"use client";

import { useFieldArray, useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  AlignLeft,
  Copy,
  DollarSign,
  Folder,
  Image,
  Plus,
  Save,
  Text,
  Trash,
  Type,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useDataContext } from "@/components/DataContextProvider";
import FilePreview from "@/components/FilePreview";
import hasDomain from "@/components/hasDomain";
import MenuCategories from "@/components/MenuCategories";
import MobileDrawer from "@/components/MobileDrawer";
import { Textarea } from "@/components/ui/textarea";
import {
  MenuResponse,
  useDeleteMenuCategory,
  useGetPublicGetCustomerMenu,
  usePostMenuCategory,
  usePostMenuCategoryOrder,
  usePostMenuItems,
} from "@/generated/endpoints";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  image: z.any(),
  tags: z.string().nullable().optional(),
});
const formSchema = z.object({
  menu: z.array(menuItemSchema),
});

const inputSchema = [
  [
    {
      id: "name",
      label: "Name",
      type: "text",
      description: "",
      icon: Type,
    },
    {
      id: "price",
      label: "Price",
      type: "number",
      description: "",
      icon: DollarSign,
    },
  ],
  [
    {
      id: "categoryId",
      label: "Category",
      type: "select",
      description: "",
      icon: Folder,
    },
  ],
  [
    {
      id: "description",
      label: "Description",
      type: "textarea",
      description: "",
      icon: AlignLeft,
    },
  ],
  [
    {
      id: "image",
      label: "Image",
      type: "file",
      description: "",
      icon: Image,
    },
  ],
  [
    {
      id: "tags",
      label: "Tags",
      type: "text",
      description: "To create multiple tags, separate words with commas (,)",
      icon: Text,
    },
  ],
] as const;

const ImagePreview = ({
  field,
  file,
  image,
}: {
  field: z.infer<typeof menuItemSchema>;
  file?: File;
  image: string;
}) =>
  file ? (
    <FilePreview className="h-20 w-20" file={file} />
  ) : (
    <>
      {field.image && image !== ACTIONS.REMOVE ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="h-20 w-20 rounded bg-gray-100 object-contain"
          src={field.image}
          alt=""
        />
      ) : (
        <div className="grid h-20 w-20 place-items-center rounded bg-gray-100 p-2 text-xs text-primary">
          No image
        </div>
      )}
    </>
  );

const DraggableItem = ({
  draggableId,
  ...props
}: React.JSX.IntrinsicElements["div"] & {
  draggableId: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: draggableId,
  });
  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && { y: transform.y, scaleY: 1, x: 0, scaleX: 1 },
    ),
    transition,
    cursor: "grab",
    zIndex: isDragging ? 2 : 1,
  };

  return (
    <div
      {...props}
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </div>
  );
};

const DataLayer = () => {
  const { selectedDomain, params } = useDataContext();

  const { data = { categories: [], menuItems: [] }, isLoading } =
    useGetPublicGetCustomerMenu(params, {
      query: {
        enabled: !!selectedDomain,
        placeholderData: (previousData) => previousData,
      },
    });

  if (isLoading) return <></>;

  return <AdminMenu data={data} />;
};

const CATEGORY_DEFAULT = { description: "", name: "" };

const AdminMenu = ({ data }: { data: MenuResponse }) => {
  const { selectedDomain, selectedConfig, params } = useDataContext();
  const isMobile = useIsMobile();
  const [deletedItems, setDeletedItems] = useState<number[]>([]);
  const [selectedFieldIndex, setSelectedField] = useState<number>();
  const [uploadedImages, setUploadedImages] = useState<Record<string, File>>(
    {},
  );
  const [lastEditedFieldId, setLastEditedFieldId] =
    useState<(typeof inputSchema)[number][number]["id"]>("name");

  const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  const [addCategory, setAddCategory] = useState<{
    name: string;
    description: string;
  }>(CATEGORY_DEFAULT);
  const { refetch } = useGetPublicGetCustomerMenu(params, {
    query: { enabled: false },
  });

  const [categoryList, setCategoryList] = useState(data.categories);
  const categories = Object.fromEntries(
    categoryList.map((item) => [item.id, item.name]),
  );
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { menu: data.menuItems },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const { fields, append, insert, remove, move } = useFieldArray({
    name: "menu",
    control: form.control,
    keyName: "formId",
  });

  const selectedField =
    selectedFieldIndex !== undefined ? fields[selectedFieldIndex] : undefined;

  useEffect(() => {
    if (!data) return;
    setCategoryList(data.categories);
    const { name, description } = data.categories.find(
      (c) => c.id === selectedCategory,
    ) || { name: "", description: "" };

    setAddCategory({ name, description });

    form.reset({ menu: data.menuItems?.map((d, i) => ({ ...d, index: i })) });
  }, [data, form, selectedCategory]);

  const { mutateAsync: updateMenu, isPending } = usePostMenuItems();
  const { mutateAsync: updateCategory } = usePostMenuCategory();
  const { mutateAsync: deleteCategory } = useDeleteMenuCategory();
  const { mutateAsync: updateCategoryOrder } = usePostMenuCategoryOrder();

  const refetchAndSync = async () => {
    const newMenu = await refetch();
    setCategoryList(newMenu.data?.categories ?? []);
  };

  const handleUpdateCategory = async () => {
    if (addCategory.name.trim()) {
      await updateCategory({
        data: {
          id: selectedCategory,
          name: addCategory.name,
          description: addCategory.description,
        },
        params,
      });
    }

    await updateCategoryOrder({
      data: categoryList.map((item, index) => ({ ...item, order: index + 1 })),
      params: { key: selectedDomain },
    });
    if (selectedCategory === -1) {
      setAddCategory({
        name: "",
        description: "",
      });
    }
    toast.success("Categories updated.");
    refetchAndSync();
  };

  const handleDeleteCategory = async () => {
    await deleteCategory({
      params: { id: selectedCategory, key: selectedDomain },
    });
    refetchAndSync();
    setSelectedCategory(-1);
    setAddCategory(CATEGORY_DEFAULT);
    toast.success("Category deleted.");
  };

  async function onSubmit() {
    remove(deletedItems);
    setDeletedItems([]);

    await handleUpdateCategory();
    await updateMenu({
      params,
      data: {
        menuItemsJson: JSON.stringify(
          form.getValues("menu").map((d, index) => ({
            ...d,
            id: d.tempId ? -1 : d.id,
            image: d.image === ACTIONS.REMOVE ? ACTIONS.REMOVE : "",
            price: Number(d.price),
            categoryId: Number(d.categoryId),
            order: index + 1,
          })),
        ),
        files: Object.entries(uploadedImages).map(
          ([key, value]) => new File([value], key),
        ),
      },
    });
    refetchAndSync();
    toast.success("Updated menu.");
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

  const Categories = (
    <MenuCategories
      category={addCategory}
      setCategory={setAddCategory}
      items={categoryList}
      setItems={setCategoryList}
      isSelected={selectedCategory !== -1}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      onClick={handleUpdateCategory}
      onDelete={handleDeleteCategory}
      onBadgeClick={(payload) => {
        setSelectedCategory(payload.isSelected ? -1 : payload.id);
        setAddCategory(
          payload.isSelected
            ? CATEGORY_DEFAULT
            : { name: payload.name, description: payload.description },
        );
      }}
      onOrderChange={(items) => setCategoryList(items)}
    />
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = fields.findIndex((i) => i.id === active.id);
      const overIndex = fields.findIndex((i) => i.id === over?.id);

      setSelectedField(overIndex);
      move(activeIndex, overIndex);
    }
  };

  if (categoryList.length === 0) {
    return (
      <div>
        <h2 className="mb-4">To get started with your menu, add a category.</h2>
        {Categories}
      </div>
    );
  }

  return (
    <div className="max-h-[72svh] md:max-h-[75svh]">
      <div
        className="grid max-h-full gap-4 overflow-auto duration-100"
        style={{
          gridTemplateColumns:
            isMobile || !selectedField ? "1fr 0fr" : "3fr 2fr",
        }}
      >
        <div className="relative grid grid-rows-[auto_1fr]">
          {Categories}
          <h2 className="mb-4 text-lg font-bold">Menu items</h2>
          <div
            key={selectedCategory}
            className="flex flex-col gap-2 p-2 duration-300 animate-in fade-in-0 slide-in-from-top-1"
          >
            <DndContext sensors={sensors} onDragEnd={onDragEnd}>
              <SortableContext
                items={fields}
                strategy={verticalListSortingStrategy}
              >
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
                    <DraggableItem key={field.formId} draggableId={field.id}>
                      <div
                        className={`relative flex flex-col justify-between gap-2 border-b md:flex-row ${selectedFieldIndex === index ? "border-l-4 border-l-primary" : ""}`}
                      >
                        <Button
                          onClick={() => {
                            setSelectedField((state) =>
                              state === index ? -1 : index,
                            );
                          }}
                          type="button"
                          className="block h-auto w-full text-left"
                          variant={(() => {
                            if (saveStaged) return "default";
                            return deleteStaged ? "destructive" : "ghost";
                          })()}
                        >
                          <div className="flex items-center gap-2">
                            <ImagePreview
                              file={uploadedImages?.[resolveImageId(field)]}
                              field={field}
                              image={form.watch(`menu.${index}.image`)}
                            />
                            <div className="grid justify-items-start">
                              <span className="text-base">
                                {form.watch(`menu.${index}.name`)}
                              </span>
                              <span className="mb-3 text-muted-foreground">
                                {form.watch(`menu.${index}.price`)}{" "}
                                {selectedConfig?.currency}
                              </span>
                              <Badge>
                                {
                                  categories[
                                    form.watch(`menu.${index}.categoryId`)
                                  ]
                                }
                              </Badge>
                            </div>
                          </div>
                        </Button>
                        <div className="mb-2 grid grid-cols-2 content-start gap-2 md:mb-0 md:grid-cols-1">
                          <Button
                            size="sm"
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
                                  : [...state, index],
                              );
                            }}
                          >
                            {deleteStaged ? <X /> : <Trash />} Delete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={() => {
                              const newIndex = index + 1;
                              const item = {
                                ...form.watch(`menu.${index}`),
                                name:
                                  form.watch(`menu.${index}.name`) + " (copy)",
                                tempId: uuidv4(),
                                id: Math.max(...fields.map((f) => f.id)) + 1,
                              };

                              insert(newIndex, { ...item, index: newIndex });
                              setSelectedField(newIndex);
                            }}
                          >
                            <Copy /> Copy
                          </Button>
                        </div>
                      </div>
                    </DraggableItem>
                  );
                })}
              </SortableContext>
            </DndContext>

            <Button
              onClick={handleAddMenuItem}
              variant="secondary"
              type="button"
            >
              <Plus /> Menu item
            </Button>
          </div>
        </div>
        <div className="md:border-l md:px-4">
          <MobileDrawer
            title={`Edit menu item - "${selectedField?.name}"`}
            open={!!selectedField}
            setIsOpen={(open) => !open && setSelectedField(-1)}
          >
            <Form {...form}>
              {selectedField &&
                selectedFieldIndex !== -1 &&
                selectedFieldIndex !== undefined && (
                  <div
                    className="sticky top-0 grid gap-4 p-4 animate-in fade-in"
                    key={selectedFieldIndex}
                  >
                    <Button
                      onClick={() => setSelectedField(-1)}
                      className="ml-auto hidden md:flex"
                      variant="ghost"
                      type="button"
                    >
                      Close
                      <X />
                    </Button>
                    {inputSchema.map((inputRow) => (
                      <div key={inputRow[0].id} className="flex gap-2">
                        {inputRow.map((input) => (
                          <FormField
                            key={input.id}
                            control={form.control}
                            name={
                              `menu.${selectedFieldIndex}.${input.id}` as const
                            }
                            render={({ field }) => {
                              let render = (
                                <Input
                                  autoFocus={input.id === lastEditedFieldId}
                                  {...field}
                                  value={field.value ?? ""}
                                  onFocus={() => setLastEditedFieldId(input.id)}
                                />
                              );

                              if (input.type === "textarea") {
                                render = (
                                  <Textarea
                                    autoFocus={input.id === lastEditedFieldId}
                                    {...field}
                                    onFocus={() =>
                                      setLastEditedFieldId(input.id)
                                    }
                                  />
                                );
                              }

                              if (input.type === "number") {
                                render = (
                                  <Input
                                    autoFocus={input.id === lastEditedFieldId}
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                    onFocus={() =>
                                      setLastEditedFieldId(input.id)
                                    }
                                    type={input.type}
                                  />
                                );
                              }

                              if (input.type === "file") {
                                render =
                                  field.value &&
                                  field.value !== ACTIONS.REMOVE ? (
                                    <Button
                                      className="block"
                                      variant="destructive"
                                      type="button"
                                      onClick={() => {
                                        form.setValue(
                                          `menu.${selectedField.index}.${input.id}` as const,
                                          selectedField.image
                                            ? ACTIONS.REMOVE
                                            : "",
                                        );

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
                                            [resolveImageId(selectedField)]:
                                              file,
                                          }));
                                          form.setValue(
                                            `menu.${selectedField.index}.${input.id}` as const,
                                            file as unknown as string,
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
                                        {categoryList
                                          .filter(Boolean)
                                          .map((c) => (
                                            <SelectItem
                                              key={c.id}
                                              value={c.id.toString()}
                                            >
                                              {c.name}
                                            </SelectItem>
                                          ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                );
                              }

                              return (
                                <FormItem className="grid flex-1">
                                  <FormLabel className="flex items-center gap-0.5">
                                    <input.icon className="size-4" />{" "}
                                    {input.label}
                                  </FormLabel>
                                  <FormControl>{render}</FormControl>
                                  {input?.description && (
                                    <FormDescription>
                                      {input?.description}
                                    </FormDescription>
                                  )}
                                  <FormMessage />
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
            </Form>
          </MobileDrawer>
        </div>
      </div>
      <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-wrap gap-2">
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
    </div>
  );
};

export default hasDomain(DataLayer);
