import React from "react";
import { getCustomerConfig } from "@/mock_db";

export default async function Test() {
  const data = await getCustomerConfig();

  return <div>{data.name}</div>;
}
