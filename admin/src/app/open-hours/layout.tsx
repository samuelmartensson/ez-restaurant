import FormLayout from "@/components/FormLayout";

export default function OpenHoursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormLayout title="Open hours">{children}</FormLayout>;
}
