"use client";
import { Button } from "@/components/ui/button";
import {
  SubscriptionState,
  useGetCustomerGetCustomer,
} from "@/generated/endpoints";
import { useUser } from "@clerk/nextjs";
import React from "react";

const StripeBuyButton = ({ email }: { email: string }) => {
  return (
    <stripe-buy-button
      customer-email={email}
      buy-button-id="buy_btn_1QZuC6LE1413aFek7ANlspq4"
      publishable-key="pk_test_51QZu6NLE1413aFeksHEv00qCjoMnnWN8W4oamT6oTMuKE8cmxtGOVASe3DB84Dp1rF0UeoYMezHthHm9to3IwdlG00d6CwJ3cH"
    />
  );
};

const Subscription = () => {
  const { user } = useUser();
  const { data } = useGetCustomerGetCustomer();

  const periodEnd =
    data?.cancelInfo?.periodEnd &&
    new Date(data?.cancelInfo?.periodEnd).toLocaleString();

  if (data?.subscription === SubscriptionState.NUMBER_0) {
    return (
      <div className="p-4 max-w-lg">
        <script async src="https://js.stripe.com/v3/buy-button.js"></script>
        <StripeBuyButton
          email={user?.primaryEmailAddress?.emailAddress ?? ""}
        />
      </div>
    );
  }

  return (
    <div className="grid p-4 max-w-lg">
      {data?.cancelInfo?.isExpired ? (
        <>
          <div className="mb-4 text-pretty">
            Your subscription expired{" "}
            <span className="font-bold">{periodEnd}</span>. Re-subscribe to
            active your account.
          </div>
          <script async src="https://js.stripe.com/v3/buy-button.js"></script>
          <StripeBuyButton
            email={user?.primaryEmailAddress?.emailAddress ?? ""}
          />

          <Button
            className="mt-4 justify-self-start"
            variant="outline"
            onClick={() =>
              window.open(
                process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_URL,
                "_blank"
              )
            }
          >
            Manage subscription
          </Button>
        </>
      ) : (
        <div className="grid gap-2">
          <h1 className="text-2xl">EZ Rest Premium</h1>
          <div className="text-sm">
            {data?.cancelInfo?.isCanceled ? "Expires" : "Renews"}
            {": "}
            <span className="font-semibold">{periodEnd}</span>
          </div>
          <Button
            className="mt-4 justify-self-start"
            variant="outline"
            onClick={() =>
              window.open(
                process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_URL,
                "_blank"
              )
            }
          >
            Manage subscription
          </Button>
        </div>
      )}
    </div>
  );
};

export default Subscription;
