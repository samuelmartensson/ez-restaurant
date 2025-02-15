import ContactForm from "@/components/ContactForm";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import NewsWidget from "@/components/NewsWidget";
import { getCustomerConfig } from "@/mock_db";

export default async function Home() {
  const data = await getCustomerConfig();
  if (!data) return null;

  return (
    <main>
      <Hero data={data} />

      {(data.sections?.newsArticles ?? [])?.length > 0 && (
        <div className="pt-16 px-2">
          <NewsWidget
            translations={data.siteTranslations || {}}
            articles={data.sections?.newsArticles ?? []}
          />
        </div>
      )}
      {data.sectionVisibility?.contactFormVisible && (
        <ContactForm data={data} />
      )}
      {(data.sections?.gallery || [])?.length > 0 && (
        <div className="pt-16 px-2">
          <Gallery
            urls={(data.sections?.gallery || [])
              ?.map((g) => g.image ?? "")
              .slice(0, 6)}
          />
        </div>
      )}
    </main>
  );
}
