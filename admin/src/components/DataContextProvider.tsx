"use client";

import {
  CustomerConfigResponse,
  useGetCustomerGetCustomer,
} from "@/generated/endpoints";
import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext<{
  configs: CustomerConfigResponse[];
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
  refetch: () => Promise<void>;
}>({
  configs: [],
  selectedDomain: "",
  setSelectedDomain: () => null,
  refetch: () => Promise.resolve(),
});

export const useDataContext = () => useContext(DataContext);

const DataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDomain, setSelectedDomain] = useState(
    sessionStorage.getItem("domain") ?? ""
  );

  const { data = [], isLoading, refetch } = useGetCustomerGetCustomer();

  const setSelectedDomainInternal = (domain: string) => {
    setSelectedDomain(domain);
    sessionStorage.setItem("domain", domain);
  };

  useEffect(() => {
    if (!selectedDomain) {
      setSelectedDomain(data?.[0]?.domain ?? "");
    }
  }, [data, selectedDomain]);

  if (isLoading) return null;

  return (
    <DataContext.Provider
      value={{
        configs: data,
        setSelectedDomain: setSelectedDomainInternal,
        selectedDomain,
        refetch: async () => {
          await refetch();
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
