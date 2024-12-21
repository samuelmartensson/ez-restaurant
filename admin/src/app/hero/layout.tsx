import FormLayout from "@/components/FormLayout";

export default function HeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormLayout title="Hero">{children}</FormLayout>;
}
