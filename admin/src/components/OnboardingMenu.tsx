"use client";

import { useDataContext } from "@/components/DataContextProvider";
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
  useGetPublicGetCustomerMenu,
  usePostMenuCategory,
  usePostMenuItems,
} from "@/generated/endpoints";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const inputSchema = [
  {
    id: "name",
    label: "Name",
    type: "text",
  },
  {
    id: "price",
    label: "Price",
    type: "number",
  },
] as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const menuItemSchema = z.object({
  categoryId: z.union([z.string(), z.number()]),
  id: z.number(),
  name: z.string().min(1),
  price: z.number(),
});

const OnboardingMenu = ({ onNextClick }: { onNextClick: () => void }) => {
  const [step, setStep] = useState<"category" | "menu">("category");
  const { selectedDomain } = useDataContext();
  const form = useForm<z.infer<typeof menuItemSchema>>({
    defaultValues: {},
  });

  const [addCategory, setAddCategory] = useState("");
  const { data: menuData = { categories: [], menuItems: [] }, refetch } =
    useGetPublicGetCustomerMenu(
      {
        key: selectedDomain,
      },
      { query: { enabled: !!selectedDomain } },
    );
  const { mutateAsync: updateCategory, isPending: isPendingCategory } =
    usePostMenuCategory();
  const { mutateAsync: updateMenu, isPending } = usePostMenuItems();

  async function onSubmit(data: z.infer<typeof menuItemSchema>) {
    const params = { key: selectedDomain };

    await updateMenu({
      data: {
        menuItemsJson: JSON.stringify([
          {
            ...data,
            price: Number(data.price),
            categoryId: Number(menuData.categories[0].id),
          },
        ]),
      },
      params,
    });
    onNextClick();
  }

  if (step === "category") {
    return (
      <div className="w-full">
        <h1 className="mb-2 text-xl">Menu category setup</h1>
        <p className="mb-8 text-pretty text-muted-foreground">
          Create your first menu category.
        </p>
        <form className="grid w-full gap-2">
          <Input
            className="flex-1"
            placeholder="Add category..."
            value={addCategory}
            onChange={(e) => setAddCategory(e.target.value)}
          />
          <Button
            type="button"
            disabled={addCategory.trim() === "" || isPendingCategory}
            onClick={async () => {
              await updateCategory({
                data: { name: addCategory, id: -1 },
                params: { key: selectedDomain },
              });
              await refetch();
              setStep("menu");
            }}
          >
            Add category
          </Button>
        </form>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div>
        <h1 className="mb-2 text-xl">Menu setup</h1>
        <p className="mb-8 text-pretty text-muted-foreground">
          {`Create your first menu item. Don't worry, you can create as many as
          you like later on.`}
        </p>
        <form
          className="grid w-full gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
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
                      <Input {...field} type={input.type} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          ))}
          <Button disabled={isPending} type="submit">
            Next
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default OnboardingMenu;
