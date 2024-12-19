"use client";

import { AppSidebar } from "@/components/AppSidebar";
import DataContextProvider from "@/components/DataContextProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import React from "react";
import "./globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased relative">
        <ClerkProvider>
          <SignedIn>
            <DataContextProvider>
              <SidebarProvider>
                <AppSidebar />
                <main className="w-full">{children}</main>
              </SidebarProvider>
            </DataContextProvider>
          </SignedIn>
        </ClerkProvider>
      </body>
    </html>
  );
}
