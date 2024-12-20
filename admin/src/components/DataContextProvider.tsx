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
  useState,
} from "react";

const DataContext = createContext<{
  configs: CustomerConfig[];
  selectedDomain: string;
  setSelectedDomain: Dispatch<SetStateAction<string>>;
}>({
  configs: [],
  selectedDomain: "",
  setSelectedDomain: () => null,
});

export const useDataContext = () => useContext(DataContext);

const DataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDomain, setSelectedDomain] = useState("");

  const { data, isLoading } = useGetCustomerGetCustomer();

  if (isLoading) return null;

  return (
    <DataContext.Provider
      value={{
        configs: data ?? [],
        setSelectedDomain,
        selectedDomain,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
