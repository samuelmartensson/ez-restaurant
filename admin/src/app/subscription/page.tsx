"use client";

import { useDataContext } from "@/components/DataContextProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import { AlertCircle, Calendar, CheckCircle, CreditCard } from "lucide-react";

const Subscription = () => {
  const { user } = useUser();
  const { customer } = useDataContext();

  const periodEnd =
    customer?.cancelInfo?.periodEnd &&
    new Date(customer.cancelInfo.periodEnd).toLocaleDateString();

  const isActive = !customer?.cancelInfo?.isExpired;
  const isCancelled = customer?.cancelInfo?.isCanceled;

  if (!customer) return null;

  return (
    <div className="max-w-screen-md p-4">
      <Card className="w-full shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">EZ Rest Premium</CardTitle>
            {isActive && !isCancelled && (
              <Badge className="bg-green-500 hover:bg-green-600">
                <CheckCircle className="mr-1 h-3.5 w-3.5" />
                Active
              </Badge>
            )}
            {isCancelled && <Badge variant="secondary">Canceled</Badge>}
            {customer?.cancelInfo?.isExpired && (
              <Badge variant="destructive">Expired</Badge>
            )}
          </div>
          <CardDescription>Manage your subscription</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Renewal Date
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium">
                  {customer?.cancelInfo?.isCanceled
                    ? `Will not renew (${periodEnd})`
                    : periodEnd}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Billing Amount
              </div>
              <div className="flex items-center">
                <CreditCard className="mr-2 h-4 w-4 text-primary" />
                <span className="font-medium">SEK 499/month</span>
              </div>
            </div>
          </div>

          {isActive && !isCancelled && (
            <div className="mt-4 rounded-md bg-blue-50 p-4 dark:bg-blue-950">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle
                    className="h-5 w-5 text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Automatic Renewal
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                    <p>
                      Your subscription will automatically renew on {periodEnd}.
                      You can cancel anytime before the renewal date.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            className="ml-auto"
            onClick={() => {
              if (isCancelled) {
                window.open(
                  `https://buy.stripe.com/test_14k5nE6OMdzP2ti8ww?prefilled_email=${user?.primaryEmailAddress?.emailAddress}`,
                  "_blank",
                );
              } else {
                window.open(
                  process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_URL +
                    `?prefilled_email=${user?.primaryEmailAddress?.emailAddress}`,
                  "_blank",
                );
              }
            }}
          >
            {isCancelled ? "Re-subscribe" : "Manage subscription"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Subscription;
