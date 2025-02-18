import DomainNotFound from "@/components/DomainNotFound";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Navigation } from "@/components/Navigation";
import { CustomerConfigResponse } from "@/generated/endpoints";
import { getCustomerConfig, getCustomerMeta } from "@/mock_db";
import { Metadata } from "next/types";
import "./globals.css";

const themes = (font: string) =>
  ({
    rustic: {
      "--font-main": font,
    },
    modern: {
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
    <style precedence="2" href="2">{`
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

export async function generateMetadata(): Promise<Metadata> {
  // read route params
  const meta = await getCustomerMeta();

  return {
    icons: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: meta?.logo ?? "",
      },
    ],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getCustomerConfig();
  const meta = await getCustomerMeta();
  if (!data?.ok) return <DomainNotFound />;

  const resolvedFont = data.font ? "Customer" : "Roboto";

  return (
    <html lang="en" style={themes(resolvedFont)[data.theme ?? "rustic"]}>
      <style precedence="1" href="1">
        {data.themeColorConfig}
      </style>
      <title>{data?.siteName}</title>
      <GoogleAnalytics
        gaId={
          process.env.NODE_ENV === "production"
            ? "G-HXVWGBHTFG"
            : "G-6EEDB0K566"
        }
        domain={data?.domain ?? ""}
      />
      <FontInitializer fontUrl={data.font} />
      <body className="antialiased relative">
        <Navigation data={data} meta={meta} />
        {children}
        <Footer data={data} />
      </body>
    </html>
  );
}
