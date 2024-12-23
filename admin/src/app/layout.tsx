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
} from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import "./globals.css";

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
            <SignedOut>
              <RedirectToSignUp />
            </SignedOut>
          </QueryClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
