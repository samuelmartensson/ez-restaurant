"use client";

import { useDataContext } from "@/components/DataContextProvider";
import hasDomain from "@/components/hasDomain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCustomerAnalytics } from "@/generated/endpoints";
import { cn } from "@/lib/utils";

const StatisticCard = ({
  title,
  value,
  previousValue,
  isLoading,
}: {
  title: string;
  value: number;
  previousValue: number;
  isLoading: boolean;
}) => {
  const periodDiff = value - previousValue;
  const isGain = periodDiff >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-normal">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="mb-4 h-8 w-20 rounded" />
        ) : (
          <div className="mb-4 text-2xl font-bold">{value}</div>
        )}
        <p className="grid gap-0.5 text-xs text-muted-foreground">
          <span>Last 30 days</span>
          {isLoading ? (
            <Skeleton className="h-4 w-8 rounded" />
          ) : (
            <span
              className={cn(
                "font-bold",
                isGain ? "text-green-700" : "text-red-700",
              )}
            >
              {isGain ? "+" : ""}
              {periodDiff}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
};

const Hero = () => {
  const { selectedDomain } = useDataContext();
  const { data, isLoading } = useGetCustomerAnalytics({
    key: selectedDomain,
  });

  return (
    <div className="grid gap-2 md:grid-cols-3">
      <StatisticCard
        isLoading={isLoading}
        title="Website visitors"
        value={Number(data?.current?.sessions ?? 0)}
        previousValue={Number(data?.previous?.sessions ?? 0)}
      />
      <StatisticCard
        isLoading={isLoading}
        title="New visitors"
        value={Number(data?.current?.newUsers ?? 0)}
        previousValue={Number(data?.previous?.newUsers ?? 0)}
      />
      <StatisticCard
        isLoading={isLoading}
        title="Menu visitors"
        value={Number(data?.currentMenu?.sessions ?? 0)}
        previousValue={Number(data?.previousMenu?.sessions ?? 0)}
      />
    </div>
  );
};

export default hasDomain(Hero);
