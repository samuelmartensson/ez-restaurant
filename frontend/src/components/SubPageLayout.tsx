import { ReactNode } from "react";

const SubPageLayout = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="pt-[140px] max-w-screen-xl m-auto px-4">
      <h1 className="text-4xl font-bold mb-8 font-customer">{title}</h1>
      <div>{children}</div>
    </div>
  );
};

export default SubPageLayout;
