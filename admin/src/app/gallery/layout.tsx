import FormLayout from "@/components/FormLayout";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormLayout title="Gallery">{children}</FormLayout>;
}
