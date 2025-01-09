import SubPageLayout from "@/components/SubPageLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { getAbout } from "@/mock_db";
import Image from "next/image";
import { Fragment } from "react";

const About = async () => {
  const data = await getAbout();
  if (!data) return null;

  const aboutSection = data.about;
  const descriptionLines = aboutSection?.description?.split("\n");

  return (
    <SubPageLayout>
      <title>{`${aboutSection?.aboutTitle} | ${data?.meta.siteName}`}</title>
      <div className="container mx-auto px-4 md:pt-16">
        <Card>
          <div>
            {aboutSection?.image && (
              <div className="p-2">
                <Image
                  src={aboutSection?.image ?? ""}
                  alt=""
                  width={600}
                  height={600}
                  className="m-auto w-full max-h-96 object-cover rounded-xl"
                />
              </div>
            )}
            <CardContent className="p-8">
              <CardTitle className="font-customer text-4xl">
                {aboutSection?.aboutTitle}
              </CardTitle>
              <CardDescription className="md:text-lg mb-4 text-muted-foreground text-pretty">
                {descriptionLines?.map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    <br />
                  </Fragment>
                ))}
              </CardDescription>
            </CardContent>
          </div>
        </Card>
      </div>
    </SubPageLayout>
  );
};

export default About;
