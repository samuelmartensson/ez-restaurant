import { SubscriptionState } from "@/generated/endpoints";
import Link from "next/link";
import { ReactElement } from "react";
import { useDataContext } from "./DataContextProvider";
import { Button } from "./ui/button";

const hasSubscription = (WrappedComponent: () => ReactElement) => {
  return function Export() {
    const { customer } = useDataContext();

    if (
      customer?.cancelInfo?.isExpired ||
      customer?.subscription === SubscriptionState.NUMBER_0
    ) {
      return (
        <div className="grid h-full w-full place-items-center">
          <div className="grid place-items-center gap-2">
            <div>Subscription required.</div>
            <Link href="/subscription">
              <Button>Go to Subscriptions</Button>
            </Link>
          </div>
        </div>
      );
    }

    return <WrappedComponent />;
  };
};

export default hasSubscription;
