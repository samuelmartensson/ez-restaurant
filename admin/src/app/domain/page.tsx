"use client";
import { useDataContext } from "@/components/DataContextProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePutCustomerCreateConfig } from "@/generated/endpoints";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Domain = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const { mutateAsync, isError } = usePutCustomerCreateConfig();
  const { setSelectedDomain, refetch } = useDataContext();

  const createConfig = async () => {
    await mutateAsync({ data: { domain: value } });
    await refetch();
    setSelectedDomain(value);
    router.push("/");
  };

  return (
    <div className="flex gap-2 max-w-lg">
      <Input
        placeholder="MyRestaurant"
        value={value}
        className={isError ? "border border-red-500" : ""}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button onClick={() => createConfig()}>Create domain</Button>
    </div>
  );
};

export default Domain;
