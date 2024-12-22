"use client";

import { AppSidebar } from "@/components/AppSidebar";
import DataContextProvider from "@/components/DataContextProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "./globals.css";
import { toast } from "sonner";

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
                  <main className="w-full">{children}</main>
                </SidebarProvider>
              </DataContextProvider>
            </SignedIn>
          </QueryClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
