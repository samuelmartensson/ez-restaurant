import { Separator } from "@/components/ui/separator";
import { getCustomerConfig } from "@/mock_db";
import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "./ui/badge";

const dayMap = {
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
  7: "sunday",
} as const;

export default async function Footer() {
  const data = await getCustomerConfig();
  const { contactUs, openHours, allRightsReserved } =
    data?.siteTranslations || {};

  return (
    <footer className="bg-white text-accent-foreground pt-8 pb-28 md:pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-lg mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(data?.email ||
            data?.phone ||
            data?.adress ||
            data?.instagramUrl) && (
            <div className="space-y-4">
              <Badge variant="secondary">
                <h3 className="font-customer text-xl">
                  {contactUs ?? "CONTACT US"}
                </h3>
              </Badge>
              {data?.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center space-x-3"
                >
                  <Mail className="h-5 w-5 text-secondary-foreground" />
                  <span>{data?.email}</span>
                </a>
              )}
              {data?.phone && (
                <a
                  href={`tel:${data.phone}`}
                  className="flex items-center space-x-3"
                >
                  <Phone className="h-5 w-5 text-secondary-foreground" />
                  <span>{data?.phone}</span>
                </a>
              )}
              {data?.adress && (
                <a
                  {...(data?.mapUrl && { href: data.mapUrl, target: "_blank" })}
                  className="flex items-center space-x-3"
                >
                  <MapPin className="h-5 w-5 text-secondary-foreground" />
                  <span>{data?.adress}</span>
                </a>
              )}
              {data?.instagramUrl && (
                <a
                  target="_blank"
                  href={data.instagramUrl}
                  className="flex items-center space-x-3"
                >
                  <Instagram className="h-5 w-5 text-secondary-foreground" />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          )}
          <div className="space-y-4">
            <Badge variant="secondary">
              <h3 id="open-hours" className="font-customer text-xl">
                {openHours ?? "OPEN HOURS"}
              </h3>
            </Badge>
            <div className="flex items-start space-x-3">
              <div className="space-y-2">
                {data?.openingHours?.map((o) => (
                  <div key={o.id} className="grid grid-cols-2 gap-x-4">
                    <span>
                      {(o.day && data.siteTranslations?.[dayMap[o.day]]) ||
                        o.label}
                    </span>
                    {o.isClosed ? (
                      <span>{data.siteTranslations?.closed ?? "Closed"}</span>
                    ) : (
                      <span>
                        {o.openTime} - {o.closeTime}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        <div className="text-center text-sm mb-4">
          © {new Date().getFullYear()} {data?.siteName}.{" "}
          {allRightsReserved ?? "All rights reserved"}.
        </div>
        {data?.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.logo}
            alt=""
            className="mx-auto h-12 max-w-[140px] sm:h-16 rounded-lg object-contain"
          />
        )}
      </div>
    </footer>
  );
}
