import FormLayout from "@/components/FormLayout";

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormLayout title="Analytics">{children}</FormLayout>;
}
