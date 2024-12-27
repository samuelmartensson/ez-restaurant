"use client";

import {
  CustomerConfigResponse,
  useGetCustomerCustomer,
} from "@/generated/endpoints";
import { useUser } from "@clerk/nextjs";
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

const domain_key = (userId: string) => `${userId}_domain`;

const DataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const domainKey = domain_key(user?.id ?? "");
  const [selectedDomain, setSelectedDomain] = useState(
    sessionStorage.getItem(domainKey) ?? "",
  );

  const { data, isLoading, refetch } = useGetCustomerCustomer();

  const setSelectedDomainInternal = (domain: string) => {
    setSelectedDomain(domain);
    sessionStorage.setItem(domainKey, domain);
  };

  useEffect(() => {
    if (!selectedDomain) {
      setSelectedDomain(data?.customerConfigs?.[0]?.domain ?? "");
    }
  }, [data, selectedDomain]);

  if (isLoading) return null;

  return (
    <DataContext.Provider
      value={{
        configs: data?.customerConfigs ?? [],
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
