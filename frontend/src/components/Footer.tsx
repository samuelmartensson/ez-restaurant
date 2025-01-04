import { Separator } from "@/components/ui/separator";
import { getCustomerConfig } from "@/mock_db";
import { Mail, MapPin, Phone } from "lucide-react";

const dayMap: { [key: number]: string } = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

export default async function Footer() {
  const data = await getCustomerConfig();
  console.log(data);

  return (
    <footer id="open-hours" className="text-gray-600 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(data?.email || data?.phone || data?.adress) && (
            <div className="space-y-4">
              <h3 className="font-customer text-lg font-semibold text-gray-900">
                Contact Us
              </h3>
              {data?.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{data?.email}</span>
                </div>
              )}
              {data?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{data?.phone}</span>
                </div>
              )}
              {data?.adress && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{data?.adress}</span>
                </div>
              )}
            </div>
          )}
          <div className="space-y-4">
            <h3 className="font-customer text-lg font-semibold text-gray-900">
              Open Hours
            </h3>
            <div className="flex items-start space-x-3">
              <div className="space-y-2">
                {data?.openingHours?.map((o) => (
                  <div key={o.id} className="grid grid-cols-2 gap-x-4">
                    <span>{(o.day && dayMap[o.day]) || o.label}</span>
                    {o.isClosed ? (
                      <span>Closed</span>
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
        <div className="text-center text-sm">
          © {new Date().getFullYear()} {data?.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
