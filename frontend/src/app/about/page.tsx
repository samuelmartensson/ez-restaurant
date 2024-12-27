import SubPageLayout from "@/components/SubPageLayout";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getCustomerConfig } from "@/mock_db";

const About = async () => {
  const data = await getCustomerConfig();
  if (!data) return null;

  return (
    <SubPageLayout>
      <div className="container mx-auto px-4 py-16">
        <Card className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <Image
                src={data.sections?.hero?.heroImage ?? ""}
                alt="Team working together"
                width={800}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="md:w-1/2 p-8">
              <h1 className="text-4xl font-bold mb-6 text-primary">About Us</h1>
              <p className="text-lg mb-4 text-muted-foreground">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Sapiente, hic similique reiciendis corporis eligendi impedit
                alias numquam quibusdam nobis dolores libero odit repudiandae,
                rem, officiis earum optio. Rem esse minus non officiis rerum?
                Deleniti modi eius ex laborum obcaecati velit.
              </p>
            </CardContent>
          </div>
        </Card>
      </div>
    </SubPageLayout>
  );
};

export default About;
