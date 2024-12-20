"use client";
import { useDataContext } from "@/components/DataContextProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getURL } from "@/utils";
import { useAuth } from "@clerk/nextjs";
import React, { useCallback, useState } from "react";

const Domain = () => {
  const [value, setValue] = useState("");
  const { getToken } = useAuth();
  const { selectedDomain } = useDataContext();

  const createConfig = useCallback(async () => {
    fetch(getURL(selectedDomain, "create-config"), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain: value }),
    });
  }, [getToken, selectedDomain, value]);

  return (
    <div className="p-4 grid gap-4">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={() => createConfig()}>Create domain</Button>
    </div>
  );
};

export default Domain;
