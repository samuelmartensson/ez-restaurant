import { Navigation } from "@/components/Navigation";
import { CustomerConfigResponse } from "@/generated/endpoints";
import { getCustomerConfig } from "@/mock_db";
import "./globals.css";
import DomainNotFound from "@/components/DomainNotFound";
import Footer from "@/components/Footer";

const themes = (font: string) =>
  ({
    rustic: {
      "--primary": "10 100% 41%",
      "--primary-50": "30 100% 94%",
      "--primary-100": "30 100% 88%",
      "--primary-200": "30 100% 80%",
      "--primary-300": "30 100% 61%",
      "--primary-400": "30 100% 53%",
      "--primary-500": "30 100% 50%",
      "--primary-600": "30 100% 47%",
      "--primary-700": "10 100% 41%",
      "--primary-800": "10 100% 35%",
      "--primary-900": "10 100% 32%",
      "--primary-950": "10 100% 19%",
      "--font-main": font,
    },
    modern: {
      "--primary-50": "60 100% 94%",
      "--primary-100": "50 100% 90%",
      "--primary-200": "48 100% 80%",
      "--primary-300": "45 100% 74%",
      "--primary-400": "42 100% 60%",
      "--primary-500": "39 100% 53%",
      "--primary-600": "36 100% 41%",
      "--primary-700": "33 100% 33%",
      "--primary-800": "30 100% 27%",
      "--primary-900": "28 100% 22%",
      "--primary-950": "20 100% 14%",
      "--font-main": font,
    },
  }) as Record<string, React.CSSProperties>;

const FontInitializer = ({
  fontUrl,
}: {
  fontUrl: CustomerConfigResponse["font"];
}) => {
  return fontUrl ? (
    // Load custom
    <style precedence="1" href="1">{`
        @font-face {
          font-family: "Customer";
          src: url("${fontUrl}");
          font-weight: normal;
          font-style: normal;
        }
        `}</style>
  ) : (
    // Load standard
    <style
      precedence="1"
      href="1"
    >{`@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');`}</style>
  );
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getCustomerConfig();
  if (!data?.ok) return <DomainNotFound />;

  const resolvedFont = data.font ? "Customer" : "Roboto";

  return (
    <html lang="en" style={themes(resolvedFont)[data.theme ?? "rustic"]}>
      <title>{data?.siteName}</title>
      <FontInitializer fontUrl={data.font} />
      <body className="antialiased relative">
        <Navigation data={data} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
