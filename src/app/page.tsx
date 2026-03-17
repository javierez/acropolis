import { PropertyGrid } from "~/components/property-grid";
import Hero from "~/components/hero";
import { ContactSection } from "~/components/contact-section";
import { ReviewsSection } from "~/components/reviews-section";
import { AboutSection } from "~/components/about-section";
import JsonLd from "~/components/json-ld";
import Footer from "~/components/footer";
import { PropertySearchWrapper } from "~/components/property-search-wrapper";
import type { Metadata } from "next";
import { getMetadataProps } from "~/server/queries/meta";

// Regenerate the page every 5 minutes with fresh data from the database
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const metadataProps = await getMetadataProps();

  // Extract mainpage metadata if it exists
  const mainpageData = metadataProps?.mainpage;
  
  const metadata: Metadata = {
    title: mainpageData?.title || "Casas y pisos, alquiler y venta",
    description: mainpageData?.description || "¿Buscas casa? Con Inmobiliaria Acropolis es más fácil. Pisos y casas en venta o alquiler.",
    keywords: mainpageData?.keywords || [],
  };

  // Handle alternates if present
  if (mainpageData?.alternates) {
    metadata.alternates = mainpageData.alternates;
  }

  // Handle OpenGraph with proper typing
  if (mainpageData?.openGraph) {
    const ogImages = mainpageData.openGraph.images?.map((img: any) => ({
      url: img.url || '',
      width: img.width,
      height: img.height,
      alt: img.alt,
    })).filter((img: any) => img.url) || [];

    metadata.openGraph = {
      title: mainpageData.openGraph.title,
      description: mainpageData.openGraph.description,
      type: (mainpageData.openGraph.type as any) || 'website',
      locale: mainpageData.openGraph.locale,
      siteName: mainpageData.openGraph.siteName,
      images: ogImages.length > 0 ? ogImages : undefined,
    };
  }

  // Handle Twitter metadata
  if (mainpageData?.twitter) {
    metadata.twitter = {
      card: (mainpageData.twitter.card as any) || 'summary_large_image',
      title: mainpageData.twitter.title,
      description: mainpageData.twitter.description,
      images: mainpageData.twitter.images,
    };
  }

  // Handle robots with proper boolean typing
  if (mainpageData?.robots) {
    const robotsIndex = typeof mainpageData.robots.index === 'number' 
      ? mainpageData.robots.index === 1 
      : mainpageData.robots.index === true;
    
    const robotsFollow = typeof mainpageData.robots.follow === 'number'
      ? mainpageData.robots.follow === 1
      : mainpageData.robots.follow === true;

    metadata.robots = {
      index: robotsIndex,
      follow: robotsFollow,
    };

    if (mainpageData.robots.googleBot) {
      const googleBotIndex = typeof mainpageData.robots.googleBot.index === 'number'
        ? mainpageData.robots.googleBot.index === 1
        : mainpageData.robots.googleBot.index === true;
      
      const googleBotFollow = typeof mainpageData.robots.googleBot.follow === 'number'
        ? mainpageData.robots.googleBot.follow === 1
        : mainpageData.robots.googleBot.follow === true;

      metadata.robots.googleBot = {
        index: googleBotIndex,
        follow: googleBotFollow,
        'max-image-preview': mainpageData.robots.googleBot['max-image-preview'] as any,
        'max-snippet': mainpageData.robots.googleBot['max-snippet'],
      };
    }
  }

  return metadata;
}

export default async function Home() {
  return (
    <>
      <div className="relative">
        {/* Hero Section - background handled by Hero component */}
        <JsonLd />
        <Hero />

        {/* Search Form Container */}
        <div className="relative z-20 -mt-16 sm:-mt-24 md:-mt-32 lg:-mt-40 px-4">
          <PropertySearchWrapper />
        </div>

        {/* Main Content */}
        <div className="relative z-10 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PropertyGrid />
            <AboutSection />
          </div>

          <ReviewsSection id="reviews" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ContactSection />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
