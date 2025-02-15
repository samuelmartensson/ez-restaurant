"use client";

import { useDataContext } from "@/components/DataContextProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePutCustomerConfig } from "@/generated/endpoints";
import { containsOnlyLetters } from "@/lib/utils";
import { useState } from "react";

interface Props {
  onNextClick: () => void;
}

const OnboardingDomain = ({ onNextClick }: Props) => {
  const [domainNameValue, setDomainNameValue] = useState("");
  const {
    mutateAsync: createConfig,
    isError,
    isPending,
  } = usePutCustomerConfig();
  const { setSelectedDomain, refetch } = useDataContext();

  const handleCreateConfig = async () => {
    await createConfig({ data: { domain: domainNameValue } });
    await refetch();
    setSelectedDomain(domainNameValue);
    onNextClick();
  };

  return (
    <div>
      <h2 className="mb-2 text-xl">Domain setup</h2>
      <p className="mb-8 text-muted-foreground">
        You can manage multiple businesses from the same EZ Rest account. Each
        one will need its own unique domain name to identify it.
      </p>
      <p className="mb-2">Start by naming and creating your first domain.</p>
      <div className="grid w-full gap-4">
        <div>
          <Input
            placeholder="My restaurant name"
            value={domainNameValue}
            className={isError ? "border border-red-500" : ""}
            onChange={(e) => {
              const value = e.target.value;
              if (containsOnlyLetters(value) || value === "") {
                setDomainNameValue(value);
              }
            }}
          />
          <div className="pt-1 text-sm text-muted-foreground">
            Only letters and numbers are allowed.
          </div>
        </div>
        <Button
          disabled={isPending || domainNameValue.trim() === ""}
          onClick={() => handleCreateConfig()}
        >
          Create domain
        </Button>
      </div>
    </div>
  );
};

export default OnboardingDomain;
