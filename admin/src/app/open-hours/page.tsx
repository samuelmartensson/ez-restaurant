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
import { Plus, Save, Trash } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
  const { selectedDomain, params } = useDataContext();
  const formNormal = useForm<PostOpeningHourMutationBody>({
    defaultValues: [],
  });
  const formSpecial = useForm<{ special: PostOpeningHourMutationBody }>({
    defaultValues: {
      special: [],
    },
  });
  const { append, remove, fields } = useFieldArray({
    name: "special",
    control: formSpecial.control,
  });

  const { data: openingHours, refetch } = useGetOpeningHour(params, {
    query: {
      enabled: !!selectedDomain,
    },
  });
  const normalOpeningHours = useMemo(
    () => openingHours?.filter((o) => o?.day !== 0),
    [openingHours],
  );
  const specialOpeningHours = useMemo(
    () => openingHours?.filter((o) => o?.day === 0),
    [openingHours],
  );

  useEffect(() => {
    if (!normalOpeningHours) return;
    formNormal.reset(normalOpeningHours);
  }, [normalOpeningHours, formNormal]);

  useEffect(() => {
    if (!specialOpeningHours) return;
    formSpecial.reset({ special: specialOpeningHours });
  }, [specialOpeningHours, formSpecial]);

  async function onSubmit(data: PostOpeningHourMutationBody) {
    updateOpeningHour({
      data: [...data, ...formSpecial.getValues("special")],
      params,
    });
    toast.success("Opening hours saved.");
    refetch();
  }
  const { mutateAsync: updateOpeningHour } = usePostOpeningHour();

  return (
    <Form {...formNormal}>
      <form
        className="grid max-w-lg gap-4 overflow-auto"
        onSubmit={formNormal.handleSubmit(onSubmit)}
      >
        {normalOpeningHours?.map((value, index) => {
          const isClosed = formNormal.watch(`${index}.isClosed`);
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
                      formNormal.setValue(`${index}.isClosed`, checked)
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
                        {...formNormal.register(`${index}.${input.id}`)}
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
        <h2 className="text-2xl">Special opening hours</h2>
        {fields?.map((value, index) => {
          const isClosed = formSpecial.watch(`special.${index}.isClosed`);
          return (
            <div key={value.id}>
              <div className="flex justify-between gap-2">
                <Button
                  onClick={() => remove(index)}
                  className="ml-auto"
                  type="button"
                  variant="destructive"
                  size="icon"
                >
                  <Trash />
                </Button>
                <div className="flex items-center space-x-2 rounded-full border p-2">
                  <Label>Open</Label>
                  <Switch
                    checked={isClosed}
                    name={`${index}.isClosed`}
                    onCheckedChange={(checked) =>
                      formSpecial.setValue(`special.${index}.isClosed`, checked)
                    }
                  />
                  <Label>Closed</Label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <FormItem className="col-span-2">
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      {...formSpecial.register(`special.${index}.label`)}
                      defaultValue={value?.label ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                {inputSchema.map((input) => (
                  <FormItem
                    style={{ display: isClosed ? "none" : "block" }}
                    key={`${index}.${input.id}`}
                  >
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                      <Input
                        {...formSpecial.register(
                          `special.${index}.${input.id}`,
                        )}
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

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            append({
              closeTime: "20:00",
              id: -1,
              isClosed: false,
              openTime: "08:00",
            });
          }}
        >
          <Plus /> Add special opening hour
        </Button>
        <Button type="submit">
          <Save /> Save
        </Button>
      </form>
    </Form>
  );
};

export default hasDomain(OpenHours);
