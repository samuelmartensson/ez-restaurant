"use client";

import { AppSidebar } from "@/components/AppSidebar";
import DataContextProvider from "@/components/DataContextProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import React from "react";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased relative">
        <ClerkProvider>
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
