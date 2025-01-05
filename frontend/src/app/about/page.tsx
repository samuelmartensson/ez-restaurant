import SubPageLayout from "@/components/SubPageLayout";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getCustomerConfig } from "@/mock_db";

const About = async () => {
  const data = await getCustomerConfig();
  if (!data) return null;

  return (
    <SubPageLayout>
      <div className="container mx-auto px-4 md:pt-16">
        <Card>
          <div>
            <div className="p-2">
              <Image
                src={data.sections?.hero?.heroImage ?? ""}
                alt="Team working together"
                width={800}
                height={600}
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
            <CardContent className="p-8">
              <h1 className="font-customer text-4xl font-bold mb-6 text-primary">
                ABOUT US
              </h1>
              <p className="text-lg mb-4 text-muted-foreground text-pretty">
                {data.aboutUsDescription}
              </p>
            </CardContent>
          </div>
        </Card>
      </div>
    </SubPageLayout>
  );
};

export default About;
