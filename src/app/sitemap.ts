import type { MetadataRoute } from "next";
import {
  getAllListingSitemapData,
  getDistinctSearchCombinations,
} from "~/server/queries/listings";
import { buildSearchSlug } from "~/lib/search-utils";
import type { PropertyType } from "~/lib/search-utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

  // Fetch data in parallel
  const [listingData, searchCombos] = await Promise.all([
    getAllListingSitemapData(),
    getDistinctSearchCombinations(),
  ]);

  // Static pages
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/contacto`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/faqs`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/vender`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    {
      url: `${baseUrl}/aviso-legal`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/proteccion-de-datos`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    { url: `${baseUrl}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    {
      url: `${baseUrl}/terminos-condiciones-venta`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/enlaces-de-interes`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Property pages
  const propertyPages: MetadataRoute.Sitemap = listingData.map((listing) => ({
    url: `${baseUrl}/propiedades/${listing.listingId}`,
    lastModified: listing.updatedAt ?? undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Search landing pages from distinct combinations
  const searchPages: MetadataRoute.Sitemap = searchCombos.map((combo) => ({
    url: `${baseUrl}/${buildSearchSlug({
      propertyType: combo.propertyType as PropertyType,
      location: combo.city,
      status: combo.status,
    })}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticPages, ...propertyPages, ...searchPages];
}
