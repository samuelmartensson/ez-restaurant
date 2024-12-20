"use client";
import { useDataContext } from "@/components/DataContextProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useDeleteCustomerDeleteCustomer,
  usePutCustomerCreateConfig,
} from "@/generated/endpoints";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Domain = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const { mutateAsync } = usePutCustomerCreateConfig();
  const { mutateAsync: deleteCustomer } = useDeleteCustomerDeleteCustomer();
  const { setSelectedDomain } = useDataContext();

  const createConfig = async () => {
    await mutateAsync({ data: { domain: value } });
    setSelectedDomain(value);
    router.push("/site");
  };

  return (
    <div className="p-4 grid gap-4">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={() => createConfig()}>Create domain</Button>
      <Button onClick={() => deleteCustomer({ params: { key: 19 } })}>
        delete
      </Button>
    </div>
  );
};

export default Domain;
