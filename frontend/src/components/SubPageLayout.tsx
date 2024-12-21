import { getCustomerConfig } from "@/mock_db";
import Image from "next/image";
import { ReactNode } from "react";

const SubPageLayout = async ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const data = await getCustomerConfig();
  if (!data) return null;

  return (
    <div className="py-8 max-w-screen-xl m-auto px-2 sm:px-4 min-h-nav-sm sm:min-h-nav">
      <div className="absolute inset-0 bg-white">
        <Image
          priority
          src={data.sections?.hero?.heroImage ?? ""}
          fill
          alt="hero"
          className="object-cover opacity-10"
        />
      </div>
      <div className="relative max-w-screen-md m-auto z-10">
        <h1 className="text-4xl font-bold mb-8 font-customer">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default SubPageLayout;
