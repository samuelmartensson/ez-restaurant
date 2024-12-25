"use client";

import { AppSidebar } from "@/components/AppSidebar";
import DataContextProvider from "@/components/DataContextProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import {
  ClerkProvider,
  RedirectToSignUp,
  SignedIn,
  SignedOut,
  ClerkLoading,
} from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import "./globals.css";
import { LoaderPinwheel } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (e) => {
        toast.error(e?.message ?? "Something went wrong");
      },
    },
  },
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased relative">
        <ClerkProvider>
          <Toaster />
          <QueryClientProvider client={queryClient}>
            <SignedIn>
              <DataContextProvider>
                <SidebarProvider>
                  <AppSidebar />
                  <main className="w-full">
                    <SidebarTrigger className="ml-1 mt-4" />
                    {children}
                  </main>
                </SidebarProvider>
              </DataContextProvider>
            </SignedIn>
            <ClerkLoading>
              <div className="grid place-items-center h-svh w-svw">
                <div className="grid place-items-center">
                  <LoaderPinwheel size={48} className="animate-spin" />
                  <h1 className="text-3xl">EZ Rest</h1>
                </div>
              </div>
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
