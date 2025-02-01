import FormLayout from "@/components/FormLayout";

export default function LanguagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormLayout title="Languages">{children}</FormLayout>;
}
