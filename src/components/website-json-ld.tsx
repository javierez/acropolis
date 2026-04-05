import { getSEOConfig } from "~/server/queries/website-config";

export default async function WebsiteJsonLd() {
  const seoConfig = await getSEOConfig();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.ogSiteName || seoConfig.name || "Inmobiliaria",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/venta-inmuebles/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
