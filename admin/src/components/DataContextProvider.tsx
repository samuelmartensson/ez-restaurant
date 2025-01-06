"use client";

import {
  CustomerConfigResponse,
  useGetCustomerCustomer,
} from "@/generated/endpoints";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import AppLoader from "./AppLoader";
import { useRouter } from "next/navigation";

const DataContext = createContext<{
  configs: CustomerConfigResponse[];
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
  customDomain: string;
  refetch: () => Promise<void>;
}>({
  configs: [],
  selectedDomain: "",
  setSelectedDomain: () => null,
  customDomain: "",
  refetch: () => Promise.resolve(),
});

export const useDataContext = () => useContext(DataContext);

const domain_key = (userId: string) => `${userId}_domain`;

const DataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const router = useRouter();
  const domainKey = domain_key(user?.id ?? "");
  const [selectedDomain, setSelectedDomain] = useState(
    sessionStorage.getItem(domainKey) ?? "",
  );

  const { data, isLoading, refetch } = useGetCustomerCustomer();
  const configs = data?.customerConfigs ?? [];

  const setSelectedDomainInternal = (domain: string) => {
    setSelectedDomain(domain);
    sessionStorage.setItem(domainKey, domain);
  };

  useEffect(() => {
    if (!selectedDomain) {
      setSelectedDomain(data?.customerConfigs?.[0]?.domain ?? "");
    }
  }, [data, selectedDomain]);

  if (isLoading) return <AppLoader />;

  if (data?.isFirstSignIn) {
    router.replace("/onboarding");
  }

  return (
    <DataContext.Provider
      value={{
        configs,
        setSelectedDomain: setSelectedDomainInternal,
        selectedDomain,
        customDomain:
          configs.find((c) => c.domain === selectedDomain)?.customDomain ?? "",
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
