"use client";

import {
  CustomerConfigResponse,
  CustomerResponse,
  useGetCustomerCustomer,
  useGetPublicGetCustomerConfig,
} from "@/generated/endpoints";
import { useUser } from "@clerk/nextjs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AppLoader from "./AppLoader";
import { useRouter } from "next/navigation";
import { keepPreviousData, useQueryClient } from "@tanstack/react-query";

const DataContext = createContext<{
  customer: CustomerResponse | undefined;
  configs: CustomerConfigResponse[];
  selectedDomain: string;
  selectedLanguage: string;
  selectedConfig: CustomerConfigResponse | undefined;
  setSelectedDomain: (domain: string) => void;
  setSelectedLanguage: (language: string) => void;
  cycleLanguage: () => void;
  customDomain: string;
  refetch: () => Promise<void>;
  params: {
    Key: string;
    Language: string;
  };
}>({
  customer: undefined,
  configs: [],
  selectedDomain: "",
  selectedLanguage: "",
  selectedConfig: undefined,
  setSelectedDomain: () => null,
  setSelectedLanguage: () => null,
  cycleLanguage: () => null,
  customDomain: "",
  refetch: () => Promise.resolve(),
  params: {
    Key: "",
    Language: "",
  },
});

export const useDataContext = () => useContext(DataContext);

const domain_key = (userId: string) => `${userId}_domain`;
const language_key = (userId: string) => `${userId}_language`;

const DataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const router = useRouter();
  const domainKey = domain_key(user?.id ?? "");
  const languageKey = language_key(user?.id ?? "");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(
    sessionStorage.getItem(domainKey) ?? "",
  );
  const queryClient = useQueryClient();

  const { data: customer, isLoading, refetch } = useGetCustomerCustomer();
  const { data: selectedConfig, refetch: refetchCf } =
    useGetPublicGetCustomerConfig(
      {
        Key: selectedDomain,
        Language: selectedLanguage,
        cache: false,
      },
      {
        query: {
          enabled: !!selectedDomain && !!selectedLanguage,
          placeholderData: keepPreviousData,
        },
      },
    );
  const configs = customer?.customerConfigs ?? [];

  const setSelectedLanguageInternal = useCallback(
    (language: string) => {
      setSelectedLanguage(language);
      sessionStorage.setItem(languageKey, language);
    },
    [languageKey],
  );

  const setSelectedDomainInternal = async (domain: string) => {
    queryClient.clear();
    setSelectedDomain(domain);
    const newDomain = await refetch();
    const languages = newDomain?.data?.customerConfigs?.find(
      (cf) => cf.domain === domain,
    )?.languages;

    if (!languages?.includes(selectedLanguage)) {
      setSelectedLanguage(languages?.[0] ?? "");
    }
    sessionStorage.setItem(domainKey, domain);
  };

  const cycleLanguage = () => {
    if (!selectedConfig?.languages) return;
    const index = selectedConfig?.languages?.findIndex(
      (l) => l === selectedLanguage,
    );
    setSelectedLanguage(
      (index >= selectedConfig.languages.length - 1
        ? selectedConfig.languages[0]
        : selectedConfig.languages[index + 1]) ?? "",
    );
  };

  const selectedLanguageOrDefault = () => {
    if (!selectedConfig?.languages?.includes(selectedLanguage)) {
      return selectedConfig?.languages?.[0] ?? "";
    }

    return selectedLanguage;
  };

  useEffect(() => {
    if (!selectedDomain) {
      setSelectedDomain(customer?.customerConfigs?.[0]?.domain ?? "");
    }
  }, [customer, selectedDomain]);

  useEffect(() => {
    if (!selectedLanguage) {
      const languages = customer?.customerConfigs?.[0]?.languages;
      const cachedLanguage = sessionStorage.getItem(languageKey) ?? "";
      setSelectedLanguage(
        (languages?.includes(cachedLanguage)
          ? cachedLanguage
          : languages?.[0]) ?? "",
      );
    }
  }, [customer, languageKey, selectedDomain, selectedLanguage]);

  if (isLoading) return <AppLoader />;

  if (customer?.isFirstSignIn) {
    router.replace("/onboarding");
  }

  return (
    <DataContext.Provider
      value={{
        customer,
        configs,
        setSelectedDomain: setSelectedDomainInternal,
        setSelectedLanguage: setSelectedLanguageInternal,
        selectedDomain,
        selectedLanguage: selectedLanguageOrDefault(),
        selectedConfig,
        customDomain: selectedConfig?.customDomain ?? "",
        cycleLanguage,
        params: { Key: selectedDomain, Language: selectedLanguage },
        refetch: async () => {
          await refetch();
          refetchCf();
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
