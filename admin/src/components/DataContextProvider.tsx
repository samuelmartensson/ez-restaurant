"use client";

import {
  CustomerConfig,
  useGetCustomerGetCustomer,
} from "@/generated/endpoints";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext<{
  configs: CustomerConfig[];
  selectedDomain: string;
  setSelectedDomain: Dispatch<SetStateAction<string>>;
  refetch: () => Promise<void>;
}>({
  configs: [],
  selectedDomain: "",
  setSelectedDomain: () => null,
  refetch: () => Promise.resolve(),
});

export const useDataContext = () => useContext(DataContext);

const DataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDomain, setSelectedDomain] = useState("");

  const { data = [], isLoading, refetch } = useGetCustomerGetCustomer();
  console.log(data);

  useEffect(() => {
    setSelectedDomain(data?.[0]?.domain ?? "");
  }, [data]);

  if (isLoading) return null;

  return (
    <DataContext.Provider
      value={{
        configs: data,
        setSelectedDomain,
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
