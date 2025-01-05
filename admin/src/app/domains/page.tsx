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
  const [expandDNSHelp, setExpandDNSHelp] = useState(false);
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
    await handleDeleteDomain();
    setSelectedDomain("");
  };

  return (
    <div className="grid max-w-lg gap-4">
      <p className="text-muted-foreground">Create a new domain</p>
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
        <p style={{ opacity: domainNameValue ? 1 : 0 }}>
          <span className="text-muted-foreground">
            Will make your website directly available on:
          </span>{" "}
          {domainNameValue}
        </p>
      </div>

      {selectedDomain && (
        <div>
          <div className="mt-6 grid justify-items-start gap-2">
            <h2 className="mb-2 text-2xl">DNS</h2>
            <div className="grid justify-items-start gap-1 text-muted-foreground">
              <p>
                To use your own domain you must register your domains URL in the
                field below and point your domain to
              </p>
              <code className="rounded bg-gray-100 px-2 py-1 text-black">
                {selectedDomain}.ezrest.se
              </code>{" "}
              <p>
                by adding a CNAME record in your providers DNS/Hosting provider
                settings.
              </p>
            </div>
            <Button
              variant="outline"
              type="button"
              onClick={() => setExpandDNSHelp((s) => !s)}
              size="lg"
            >
              How do I do this?
            </Button>
            {expandDNSHelp && (
              <ol className="grid list-disc gap-2 pl-5">
                <li>
                  <strong>Log in to your DNS providers dashboard</strong>: This
                  could be your domain registrar (like GoDaddy, One.com, Loopia)
                  or a hosting provider with DNS management tools.
                </li>
                <li>
                  <strong>Navigate to DNS Management</strong>:{" "}
                  {`Look for options
                  like "DNS Settings," "DNS Management," or "Advanced DNS" to
                  access your domain's DNS records.`}
                </li>
                <li>
                  <strong>Add a New CNAME Record</strong>: Select the option to
                  {`"Add Record" or "Create New Record."`} Choose{" "}
                  <code>CNAME</code> as the record type.
                </li>
                <li>
                  <strong>Enter the domain and Target</strong>:
                  <ul>
                    <li>
                      {`In the "Name" field, enter the subdomain you want to point
                      (e.g., "www" or "blog"). Leave blank if you want to use
                      your apex domain.`}
                    </li>
                    <li>
                      {`In the "Value" or "Points to" field, enter the full domain
                      name, it should resolve to: "${selectedDomain}.ezrest.se".`}
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Save the Record</strong>:{" "}
                  {`Click the "Save" or "Add
                  Record" button to save the changes.`}
                </li>
                <li>
                  <strong>Wait for Propagation</strong>: It may take a few
                  minutes to several hours for DNS changes to propagate across
                  the internet.
                </li>
              </ol>
            )}
            {customDomain ? (
              <Button
                disabled={isPendingDeleteDomain}
                onClick={() => handleDeleteDomain()}
              >
                Remove {`"${customDomain}"`}
              </Button>
            ) : (
              <div className="flex w-full gap-2">
                <Input
                  placeholder="mydomain.com"
                  value={customDomainValue}
                  className={isError ? "border border-red-500" : ""}
                  onChange={(e) => setCustomDomainValue(e.target.value)}
                />
                <Button
                  disabled={isPendingRegisterDomain || !customDomainValue}
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
