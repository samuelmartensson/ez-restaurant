import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getCustomerConfig } from "@/mock_db";

export default async function Footer() {
  const data = await getCustomerConfig();

  return (
    <footer className="text-gray-600 py-8 px-4 sm:px-6 lg:px-8">
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
              Opening Hours
            </h3>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-x-4">
                  <span>Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <span>Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </div>
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
