"use client";

import { CustomerConfig } from "@/types";
import { getURL } from "@/utils";
import { useAuth } from "@clerk/nextjs";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
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
  const [data, setData] = useState<CustomerConfig[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchCustomer = useCallback(async () => {
    try {
      const res = await fetch(getURL("", "get-customer"), {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }).then((r) => r.json());

      setData(res?.configs ?? []);
      setSelectedDomain(res.configs?.[0]?.domain ?? "");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  if (loading) return null;

  return (
    <DataContext.Provider
      value={{ configs: data, setSelectedDomain, selectedDomain }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
