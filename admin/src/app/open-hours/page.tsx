"use client";

import { useDataContext } from "@/components/DataContextProvider";
import hasDomain from "@/components/hasDomain";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  PostOpeningHourMutationBody,
  useGetOpeningHour,
  usePostOpeningHour,
} from "@/generated/endpoints";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const dayMap: { [key: number]: string } = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

const inputSchema = [
  {
    id: "openTime",
    label: "Open",
    type: "time",
  },
  {
    id: "closeTime",
    label: "Close",
    type: "time",
  },
] as const;

const OpenHours = () => {
  const { selectedDomain } = useDataContext();
  const form = useForm<PostOpeningHourMutationBody>({
    defaultValues: [],
  });

  const { data: openingHours, refetch } = useGetOpeningHour(
    {
      key: selectedDomain,
    },
    {
      query: {
        enabled: !!selectedDomain,
      },
    },
  );

  useEffect(() => {
    if (!openingHours) return;
    form.reset(openingHours);
  }, [openingHours, form]);

  async function onSubmit(data: PostOpeningHourMutationBody) {
    updateOpeningHour({
      data: data,
      params: { key: selectedDomain },
    });
    toast.success("Opening hours saved.");
    refetch();
  }
  const { mutateAsync: updateOpeningHour } = usePostOpeningHour();

  return (
    <Form {...form}>
      <form
        className="grid max-w-lg gap-4 overflow-auto p-4"
        onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
      >
        {openingHours?.map((value, index) => {
          const isClosed = form.watch(`${index}.isClosed`);
          return (
            <div key={value.id}>
              <div className="flex justify-between gap-2">
                <span>{value.day && dayMap[value.day]}</span>
                <div className="flex items-center space-x-2 rounded-full border p-2">
                  <Label>Open</Label>
                  <Switch
                    checked={isClosed}
                    name={`${index}.isClosed`}
                    onCheckedChange={(checked) =>
                      form.setValue(`${index}.isClosed`, checked)
                    }
                  />
                  <Label>Closed</Label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {inputSchema.map((input) => (
                  <FormItem
                    style={{ display: isClosed ? "none" : "block" }}
                    key={`${index}.${input.id}`}
                  >
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                      <Input
                        {...form.register(`${index}.${input.id}`)}
                        defaultValue={value[input.id]}
                        type="time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ))}
              </div>
            </div>
          );
        })}

        <Button type="submit">
          <Save /> Save
        </Button>
      </form>
    </Form>
  );
};

export default hasDomain(OpenHours);
