"use client";
import {
  SubscriptionState,
  useGetCustomerGetCustomer,
} from "@/generated/endpoints";
import { useUser } from "@clerk/nextjs";
import React from "react";

const Subscription = () => {
  const { user } = useUser();
  const { data } = useGetCustomerGetCustomer();

  return (
    <div className="p-4">
      {data?.subscription === SubscriptionState.NUMBER_0 ? (
        <>
          <script async src="https://js.stripe.com/v3/buy-button.js"></script>

          <stripe-buy-button
            customer-email={user?.primaryEmailAddress}
            buy-button-id="buy_btn_1QZuC6LE1413aFek7ANlspq4"
            publishable-key="pk_test_51QZu6NLE1413aFeksHEv00qCjoMnnWN8W4oamT6oTMuKE8cmxtGOVASe3DB84Dp1rF0UeoYMezHthHm9to3IwdlG00d6CwJ3cH"
          ></stripe-buy-button>
        </>
      ) : (
        <h1 className="text-2xl">You are premium subscribed!</h1>
      )}
    </div>
  );
};

export default Subscription;
