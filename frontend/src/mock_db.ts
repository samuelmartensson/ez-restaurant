import { headers } from "next/headers";
import { CUSTOMER_ID_HEADER } from "./middleware";

export const getCustomerConfig = async () => {
  const headerList = await headers();
  const customerId = headerList.get(CUSTOMER_ID_HEADER);
  const response = await fetch(
    `http://localhost:5232/customer/get-customer-config?key=${customerId}`
  ).then((r) => r.json());

  return response;
};
