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
  useDeleteCustomerDomain,
  usePostCustomerDomain,
  usePutCustomerConfig,
} from "@/generated/endpoints";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Domain = () => {
  const router = useRouter();
  const [domainNameValue, setDomainNameValue] = useState("");
  const [customDomainValue, setCustomDomainValue] = useState("");
  const {
    mutateAsync: createConfig,
    isError,
    isPending,
  } = usePutCustomerConfig();
  const { mutateAsync: registerDomain, isPending: isPendingRegisterDomain } =
    usePostCustomerDomain();
  const { mutateAsync: deleteDomain, isPending: isPendingDeleteDomain } =
    useDeleteCustomerDomain();
  const { mutateAsync: deleteConfig, isPending: isPendingDelete } =
    useDeleteCustomerConfig();
  const { setSelectedDomain, selectedDomain, customDomain, refetch } =
    useDataContext();

  useEffect(() => {
    setCustomDomainValue(customDomain);
  }, [customDomain]);

  const handleCreateConfig = async () => {
    await createConfig({ data: { domain: domainNameValue } });
    await refetch();
    setSelectedDomain(domainNameValue);
    router.push("/");
  };

  const handleRegisterDomain = async () => {
    await registerDomain(
      {
        params: { domainName: customDomainValue, key: selectedDomain },
      },
      {
        onSuccess: () => {
          toast.success(`Added domain ${customDomainValue}`);
        },
        onError: (e) => {
          if ((e as { error?: string })?.error === "domain_already_in_use") {
            toast.error(
              "This domain is already registered by a different domain or account.",
            );
          }
        },
      },
    );
    await refetch();
  };

  const handleDeleteDomain = async () => {
    await deleteDomain({
      params: { key: selectedDomain },
    });
    await refetch();
  };

  const handleDeleteConfig = async () => {
    await deleteConfig({ params: { key: selectedDomain } });
    await refetch();
    setSelectedDomain("");
  };

  return (
    <div className="grid max-w-lg gap-4">
      <div className="grid gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="My restaurant name"
            value={domainNameValue}
            className={isError ? "border border-red-500" : ""}
            onChange={(e) => setDomainNameValue(e.target.value)}
          />
          <Button disabled={isPending} onClick={() => handleCreateConfig()}>
            Create domain
          </Button>
        </div>
      </div>
      {selectedDomain && (
        <div>
          <div className="mt-16 grid gap-2">
            <h2 className="mb-2">DNS</h2>
            <Separator />
            {customDomain ? (
              <Button
                disabled={isPendingDeleteDomain}
                onClick={() => handleDeleteDomain()}
              >
                Remove {`"${customDomain}"`}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="mydomain.com"
                  value={customDomainValue}
                  className={isError ? "border border-red-500" : ""}
                  onChange={(e) => setCustomDomainValue(e.target.value)}
                />
                <Button
                  disabled={isPendingRegisterDomain}
                  onClick={() => handleRegisterDomain()}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
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
                    This action cannot be undone. This will permanently delete
                    the <span className="font-bold">{selectedDomain}</span>{" "}
                    domain and all its assets.
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
        </div>
      )}
    </div>
  );
};

export default Domain;
