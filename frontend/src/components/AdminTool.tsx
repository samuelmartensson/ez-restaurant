"use client";
import { CustomerConfig } from "@/types";
import { useRouter } from "next/navigation";
import React from "react";

const AdminTool = (data: CustomerConfig) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/admin")}
      className="fixed cursor-pointer bottom-0 right-0 bg-white rounded border p-4"
    >
      <div>Customer ID: {data.customer_id}</div>
      <div>Domain: {data.domain}</div>
      <div>Theme: {data.theme}</div>
    </div>
  );
};

export default AdminTool;
