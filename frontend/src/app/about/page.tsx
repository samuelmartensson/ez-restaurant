import SubPageLayout from "@/components/SubPageLayout";
import { getAbout } from "@/mock_db";
import Image from "next/image";
import { Fragment } from "react";

const About = async () => {
  const data = await getAbout();
  if (!data) return null;

  const aboutSection = data.about;
  const descriptionLines = aboutSection?.description?.split("\n");

  return (
    <SubPageLayout title={aboutSection.aboutTitle ?? ""}>
      <title>{`${aboutSection?.aboutTitle} | ${data?.meta.siteName}`}</title>
      <div className="gap-2 grid mx-auto">
        <div className="w-full h-full flex md:flex-row flex-col rounded-3xl bg-white">
          {aboutSection.image && (
            <Image
              width={600}
              height={600}
              className="md:m-5 md:rounded-2xl rounded-3xl md:size-80 md:aspect-square w-full h-80 object-cover"
              src={aboutSection.image}
              alt=""
            />
          )}
          <div className="p-5 grid content-start">
            <div className="mt-6 mb-2 text-3xl font-bold font-customer">
              {aboutSection.aboutTitle}: {data.meta.siteName}
            </div>
            <div className="flex gap-4 mb-4 leading-relaxed">
              {descriptionLines?.map((line, index) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SubPageLayout>
  );
};

export default About;
