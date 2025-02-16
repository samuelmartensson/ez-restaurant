import { getCustomerMeta } from "@/mock_db";
import Image from "next/image";
import { ReactNode } from "react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const SubPageLayout = async ({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: ReactNode;
}) => {
  const data = await getCustomerMeta();
  if (!data) return null;

  return (
    <div className="relative min-h-[70svh]">
      {data.image && (
        <div className="absolute inset-0 bg-white">
          <Image
            priority
            src={data.image ?? ""}
            fill
            alt="hero"
            className="object-cover opacity-10"
          />
        </div>
      )}
      <div
        className={cn(
          "relative pt-8 md:pt-36 pb-8 px-2 max-w-screen-lg m-auto z-10",
          className
        )}
      >
        {title && (
          <Badge className="mb-4">
            <h1 className="text-4xl md:text-5xl font-bold font-customer break-all">
              {title}
            </h1>
          </Badge>
        )}
        {children}
      </div>
    </div>
  );
};

export default SubPageLayout;
