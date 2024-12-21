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
  const { mutateAsync } = usePutCustomerCreateConfig();
  const { setSelectedDomain, refetch } = useDataContext();

  const createConfig = async () => {
    await mutateAsync({ data: { domain: value } });
    await refetch();
    setSelectedDomain(value);
    router.push("/");
  };

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold">Create a new domain</h1>
      <Input
        placeholder="MyRestaurant"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button onClick={() => createConfig()}>Create domain</Button>
    </div>
  );
};

export default Domain;
