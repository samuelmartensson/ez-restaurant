import { Separator } from "@/components/ui/separator";

export default function FormLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid max-w-screen-xl gap-4 p-3 md:p-6">
      <h1 className="text-2xl">{title}</h1>
      <Separator />
      {children}
    </div>
  );
}
