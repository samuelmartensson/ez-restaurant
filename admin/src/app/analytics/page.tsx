"use client";

import { useDataContext } from "@/components/DataContextProvider";
import hasDomain from "@/components/hasDomain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCustomerAnalytics } from "@/generated/endpoints";
import { cn } from "@/lib/utils";

const StatisticCard = ({
  title,
  value,
  previousValue,
}: {
  title: string;
  value: number;
  previousValue: number;
}) => {
  const periodDiff = value - previousValue;
  const isGain = periodDiff >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-normal">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-2xl font-bold">{value}</div>
        <p className="grid gap-0.5 text-xs text-muted-foreground">
          <span>Last 30 days</span>
          <span
            className={cn(
              "font-bold",
              isGain ? "text-green-700" : "text-red-700",
            )}
          >
            {isGain ? "+" : ""}
            {periodDiff}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

const Hero = () => {
  const { selectedDomain } = useDataContext();
  const { data } = useGetCustomerAnalytics({
    key: selectedDomain,
  });

  return (
    <div className="grid gap-2 md:grid-cols-3">
      <StatisticCard
        title="Website visitors"
        value={Number(data?.current?.sessions ?? 0)}
        previousValue={Number(data?.previous?.sessions ?? 0)}
      />
      <StatisticCard
        title="New visitors"
        value={Number(data?.current?.newUsers ?? 0)}
        previousValue={Number(data?.previous?.newUsers ?? 0)}
      />
      <StatisticCard
        title="Menu visitors"
        value={Number(data?.currentMenu?.sessions ?? 0)}
        previousValue={Number(data?.previousMenu?.sessions ?? 0)}
      />
    </div>
  );
};

export default hasDomain(Hero);
