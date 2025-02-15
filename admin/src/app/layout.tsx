"use client";

import { AppSidebar } from "@/components/AppSidebar";
import DataContextProvider, {
  useDataContext,
} from "@/components/DataContextProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import {
  ClerkLoading,
  ClerkProvider,
  RedirectToSignUp,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import "./globals.css";
import AppLoader from "@/components/AppLoader";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (e) => {
        toast.error(e?.message ?? "Something went wrong");
      },
    },
  },
});

const Content = ({ children }: { children: React.ReactNode }) => {
  const { selectedLanguage, selectedDomain, cycleLanguage, selectedConfig } =
    useDataContext();

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="sticky top-0 z-10 flex items-center gap-1 border-b bg-white py-3 pl-2 md:pl-4">
          <SidebarTrigger />
          {(selectedConfig?.languages ?? []).length > 1 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => cycleLanguage()}
              className="flex"
            >
              <Languages />
              <div className="grid gap-0 text-left text-sm leading-none">
                <span>{selectedDomain}</span>
                <span className="text-muted-foreground">
                  {selectedLanguage}
                </span>
              </div>
            </Button>
          )}
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <title>EZ Rest</title>
      <body className="relative antialiased">
        <ClerkProvider>
          <Toaster position="bottom-center" />
          <QueryClientProvider client={queryClient}>
            <SignedIn>
              <DataContextProvider>
                <Content>{children}</Content>
              </DataContextProvider>
            </SignedIn>
            <ClerkLoading>
              <AppLoader />
            </ClerkLoading>
            <SignedOut>
              <RedirectToSignUp />
            </SignedOut>
          </QueryClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
