import BrandLogo from "@/components/BrandLogo";
import "../globals.css";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b px-6 py-4">
        <BrandLogo className="h-16 w-auto" />
      </header>
      {children}
    </>
  );
}
