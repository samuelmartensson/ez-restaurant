import FormLayout from "@/components/FormLayout";

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormLayout title="News">{children}</FormLayout>;
}
