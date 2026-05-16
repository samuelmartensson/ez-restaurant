"use client";

import ActionBar from "@/components/ActionBar";
import { useDataContext } from "@/components/DataContextProvider";
import hasDomain from "@/components/hasDomain";
import LocalizedFormField from "@/components/LocalizedFormField";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  GetOpeningHour200Item,
  PostOpeningHourMutationBody,
  useGetOpeningHour,
  usePostOpeningHour,
} from "@/generated/endpoints";
import { mapToLocalizedFields } from "@/utils/mapToLocalizedFields";
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

const DataLayer = () => {
  const { selectedDomain, selectedLanguage, params } = useDataContext();

  const { data: openingHours, isLoading } = useGetOpeningHour(params, {
    query: {
      enabled: !!selectedDomain,
      placeholderData: (previousData) => previousData,
    },
  });

  const normalOpeningHours = useMemo(
    () => (openingHours || []).filter((o) => o?.[selectedLanguage]?.day !== 0),
    [openingHours, selectedLanguage],
  );
  const specialOpeningHours = useMemo(
    () => (openingHours || []).filter((o) => o?.[selectedLanguage]?.day === 0),
    [openingHours, selectedLanguage],
  );

  if (isLoading) return <></>;

  return <OpenHours {...{ normalOpeningHours, specialOpeningHours }} />;
};

const OpenHours = ({
  normalOpeningHours,
  specialOpeningHours,
}: {
  normalOpeningHours: GetOpeningHour200Item[];
  specialOpeningHours: GetOpeningHour200Item[];
}) => {
  const { selectedConfig, selectedLanguage, selectedDomain, params } =
    useDataContext();

  const formNormal = useForm<PostOpeningHourMutationBody>({
    defaultValues: normalOpeningHours,
  });

  const formSpecial = useForm<{ special: PostOpeningHourMutationBody }>({
    defaultValues: {
      special: specialOpeningHours,
    },
  });

  const { append, remove, fields } = useFieldArray({
    name: "special",
    control: formSpecial.control,
  });

  const { refetch } = useGetOpeningHour(params, {
    query: {
      enabled: !!selectedDomain,
    },
  });
  const { mutateAsync: updateOpeningHour } = usePostOpeningHour();

  async function onSubmit(data: PostOpeningHourMutationBody) {
    await updateOpeningHour({
      data: [...Object.values(data), ...formSpecial.getValues("special")].map(
        (i) => ({
          ...i,
          id: Number(i.id),
          localizedFields: mapToLocalizedFields(
            selectedConfig?.languages ?? [],
            i.localizedFields ?? {},
            ["label"],
          ),
        }),
      ),
      params,
    });
    toast.success("Opening hours saved.");
    refetch();
  }

  // useEffect(() => {
  //   if (!normalOpeningHours) return;
  //   formNormal.reset(normalOpeningHours);
  // }, [normalOpeningHours, formNormal]);

  useEffect(() => {
    if (!specialOpeningHours) return;

    formSpecial.reset({
      special: specialOpeningHours.map((item) => ({
        ...item[selectedLanguage],
        localizedFields: mapToLocalizedFields(
          selectedConfig?.languages ?? [],
          item || {},
          ["label"],
        ),
      })),
    });
  }, [
    specialOpeningHours,
    formSpecial,
    selectedConfig?.languages,
    selectedLanguage,
  ]);

  return (
    <Form {...formNormal}>
      <form
        className="grid gap-4 overflow-auto pb-16"
        onSubmit={formNormal.handleSubmit(onSubmit)}
      >
        <div className="flex flex-wrap gap-16 sm:gap-8">
          <div className="min-w-80 max-w-lg flex-1">
            <h2 className="mb-6 text-xl">Regular hours</h2>
            <div className="grid gap-4">
              {normalOpeningHours?.map((item, index) => {
                const value = item[selectedLanguage];
                const isClosed = formNormal.watch(`${index}.isClosed`);
                console.log(value.day && dayMap[value.day], isClosed);
                return (
                  <div
                    key={value.id + String(isClosed)}
                    className="border-b-2 pb-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{value.day && dayMap[value.day]}</span>
                      <FormField
                        control={formNormal.control}
                        name={`${index}.isClosed`}
                        defaultValue={!!value?.isClosed}
                        render={({ field }) => {
                          return (
                            <FormItem className="flex items-center space-x-2 rounded-full">
                              <FormLabel className="pb-0">Closed</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <FormItem
                        style={{ display: isClosed ? "none" : "block" }}
                      >
                        <FormControl>
                          <Input
                            {...formNormal.register(`${index}.openTime`)}
                            defaultValue={value.openTime}
                            type="time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <FormItem
                        style={{ display: isClosed ? "none" : "block" }}
                      >
                        <FormControl>
                          <Input
                            {...formNormal.register(`${index}.closeTime`)}
                            defaultValue={value.closeTime}
                            type="time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <Input
                        type="hidden"
                        {...formNormal.register(`${index}.id`)}
                        defaultValue={Number(value.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="min-w-80 max-w-lg flex-1">
            <h2 className="text-xl">Special opening hours</h2>
            <div className="grid gap-4">
              {fields?.map((value, index) => {
                const isClosed = formSpecial.watch(`special.${index}.isClosed`);
                const localizedFields = formSpecial.watch(
                  `special.${index}.localizedFields`,
                );

                return (
                  <div key={value.id} className="border-b-2 pb-2">
                    <div className="grid grid-cols-2 gap-2">
                      <FormItem className="col-span-2">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            {localizedFields?.[selectedLanguage]?.label ?? "-"}
                          </div>
                          <div className="ml-auto flex justify-between gap-2">
                            <div className="flex items-center space-x-2 rounded-full">
                              <Switch
                                checked={isClosed}
                                name={`${index}.isClosed`}
                                onCheckedChange={(checked) =>
                                  formSpecial.setValue(
                                    `special.${index}.isClosed`,
                                    checked,
                                  )
                                }
                              />
                              <Label>Closed</Label>
                            </div>
                            <Button
                              onClick={() => remove(index)}
                              className="ml-auto"
                              type="button"
                              variant="ghost"
                              size="icon"
                            >
                              <Trash />
                            </Button>
                          </div>
                        </div>
                        <LocalizedFormField name="label">
                          {(name) => (
                            <Input
                              className="mt-1"
                              {...formSpecial.register(
                                `special.${index}.localizedFields.${name}`,
                              )}
                            />
                          )}
                        </LocalizedFormField>
                        <FormMessage />
                      </FormItem>
                      <FormItem
                        style={{ display: isClosed ? "none" : "block" }}
                      >
                        <FormControl>
                          <Input
                            {...formNormal.register(`${index}.openTime`)}
                            defaultValue={value.openTime}
                            type="time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <FormItem
                        style={{ display: isClosed ? "none" : "block" }}
                      >
                        <FormControl>
                          <Input
                            {...formNormal.register(`${index}.closeTime`)}
                            defaultValue={value.closeTime}
                            type="time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                      <Input
                        type="hidden"
                        {...formNormal.register(`${index}.id`)}
                        defaultValue={Number(value.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              className="mt-6 w-full"
              type="button"
              variant="outline"
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
          </div>
        </div>

        <ActionBar>
          <Button type="submit">
            <Save /> Save
          </Button>
        </ActionBar>
      </form>
    </Form>
  );
};

export default hasDomain(DataLayer);
