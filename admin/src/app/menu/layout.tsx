import FormLayout from "@/components/FormLayout";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormLayout title="Menu">{children}</FormLayout>;
}
