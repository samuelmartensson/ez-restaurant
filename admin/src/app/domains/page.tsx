"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDataContext } from "@/components/DataContextProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useDeleteCustomerConfig,
  usePutCustomerConfig,
} from "@/generated/endpoints";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const Domain = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const {
    mutateAsync: createConfig,
    isError,
    isPending,
  } = usePutCustomerConfig();
  const { mutateAsync: deleteConfig, isPending: isPendingDelete } =
    useDeleteCustomerConfig();
  const { setSelectedDomain, selectedDomain, refetch } = useDataContext();

  const handleCreateConfig = async () => {
    await createConfig({ data: { domain: value } });
    await refetch();
    setSelectedDomain(value);
    router.push("/");
  };

  const handleDeleteConfig = async () => {
    await deleteConfig({ params: { key: selectedDomain } });
    await refetch();
    setSelectedDomain("");
  };

  return (
    <div className="grid gap-4">
      <div className="flex max-w-lg gap-2">
        <Input
          placeholder="My restaurant name"
          value={value}
          className={isError ? "border border-red-500" : ""}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button disabled={isPending} onClick={() => handleCreateConfig()}>
          Create domain
        </Button>
      </div>
      {selectedDomain && (
        <div className="mt-16 grid gap-2">
          <h2 className="mb-2">Danger zone</h2>
          <Separator />
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="justify-self-start"
                disabled={isPendingDelete}
                size="sm"
                variant="destructive"
              >
                Delete {`"${selectedDomain}"`}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the{" "}
                  <span className="font-bold">{selectedDomain}</span> domain and
                  all its assets.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="destructive"
                  type="button"
                  onClick={handleDeleteConfig}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default Domain;
