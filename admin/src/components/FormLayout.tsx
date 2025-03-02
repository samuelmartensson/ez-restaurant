import { Separator } from "@/components/ui/separator";

export default function FormLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid max-w-screen-xl gap-4 p-3 duration-150 fade-in md:p-6">
      <h1 className="text-2xl duration-150 animate-in fade-in slide-in-from-top-1">
        {title}
      </h1>
      <Separator />
      {children}
    </div>
  );
}
