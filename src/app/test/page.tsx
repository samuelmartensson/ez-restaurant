import { getCustomerConfig } from "@/mock_db";
import { headers } from "next/headers";
import React from "react";

export default async function Test() {
  const data = await getCustomerConfig();

  return <div>{data.name}</div>;
}
