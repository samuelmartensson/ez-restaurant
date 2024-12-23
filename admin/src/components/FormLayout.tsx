export default function FormLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 p-3 md:p-6">
      <h1 className="text-2xl">{title}</h1>
      {children}
    </div>
  );
}
