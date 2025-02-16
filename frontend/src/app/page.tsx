import ContactForm from "@/components/ContactForm";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import NewsWidget from "@/components/NewsWidget";
import { getCustomerConfig, getCustomerMeta } from "@/mock_db";

export default async function Home() {
  const data = await getCustomerConfig();
  const meta = await getCustomerMeta();
  if (!data) return null;

  return (
    <main>
      <Hero data={data} meta={meta} />
      {(data.sections?.newsArticles ?? [])?.length > 0 && (
        <div className="py-16 px-2 bg-gray-100">
          <NewsWidget
            translations={data.siteTranslations || {}}
            articles={data.sections?.newsArticles?.slice(0, 4) ?? []}
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
