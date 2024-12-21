import FormLayout from "@/components/FormLayout";

export default function DomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormLayout title="Domain">{children}</FormLayout>;
}
