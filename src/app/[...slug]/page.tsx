import type { Metadata } from "next";
import Link from "next/link";
import { searchListings, type SearchFilters, type SortOption } from "~/server/queries/listings";
import { PropertyCard } from "~/components/listing-card";
import { getCities, getPriceRange } from "~/server/actions/locations";
import { getWatermarkConfig } from "~/server/queries/watermark";
import { env } from "~/env";
import { PropertyCardSkeleton } from "~/components/property-card-skeleton";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { parseSearchSlug, type PropertyType } from "~/lib/search-utils";
import Footer from "~/components/footer";
import { SearchBar } from "~/components/search-bar";
import { SortDropdown } from "~/components/sort-dropdown";
import { Suspense } from "react";

// Generate dynamic metadata based on search parameters
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const unwrappedParams = await params;
  const slugString = unwrappedParams.slug.join("/");
  const parsedParams = parseSearchSlug(slugString);
  const {
    location = "",
    propertyType = "any",
    status = "for-sale",
    isOportunidad,
  } = parsedParams;

  // Build title and description based on search parameters
  let title = "Propiedades";
  let description = "Explora nuestras propiedades disponibles.";

  if (status === "for-rent") {
    title = "Propiedades en Alquiler";
    description =
      "Encuentra propiedades en alquiler en las mejores ubicaciones.";
  } else if (status === "for-sale") {
    title = "Propiedades en Venta";
    description =
      "Descubre propiedades en venta que se adaptan a tus necesidades.";
  }

  if (propertyType !== "any") {
    const propertyTypeLabels: Record<Exclude<PropertyType, "any">, string> = {
      piso: status === "for-rent" ? "Pisos en Alquiler" : "Pisos en Venta",
      casa: status === "for-rent" ? "Casas en Alquiler" : "Casas en Venta",
      local: status === "for-rent" ? "Locales en Alquiler" : "Locales en Venta",
      solar: "Solares en Venta",
      garaje: status === "for-rent" ? "Garajes en Alquiler" : "Garajes en Venta",
      edificio: status === "for-rent" ? "Edificios en Alquiler" : "Edificios en Venta",
      oficina: status === "for-rent" ? "Oficinas en Alquiler" : "Oficinas en Venta",
      industrial: status === "for-rent" ? "Naves Industriales en Alquiler" : "Naves Industriales en Venta",
      trastero: status === "for-rent" ? "Trasteros en Alquiler" : "Trasteros en Venta",
    };

    if (propertyType in propertyTypeLabels) {
      title = propertyTypeLabels[propertyType];
    }
  }

  // Handle oportunidad filter
  if (isOportunidad) {
    title += " - Oportunidad";
    description = "Descubre nuestras mejores oportunidades inmobiliarias.";
  }

  if (location && location !== "todas-ubicaciones") {
    const locationName = decodeURIComponent(location.replace(/-/g, " "));
    const capitalizedLocationName =
      locationName.charAt(0).toUpperCase() + locationName.slice(1);
    title += ` en ${capitalizedLocationName}`;
    description += ` en ${capitalizedLocationName}.`;
  }

  return {
    metadataBase: new URL("https://acropolis-realestate.com"),
    title: `${title} | Acropolis Bienes Raíces`,
    description,
    openGraph: {
      title: `${title} | Acropolis Bienes Raíces`,
      description,
      url: `/${slugString}`,
      type: "website",
    },
    alternates: {
      canonical: `/${slugString}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface SearchPageProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{
    sort?: string;
  }>;
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  // Join the slug array into a single string
  const unwrappedParams = await params;
  const unwrappedSearchParams = await searchParams;
  const slugString = unwrappedParams.slug.join("/");
  const validSorts: SortOption[] = ["default", "newest", "price-asc", "price-desc", "size-asc", "size-desc"];
  const sort: SortOption = validSorts.includes(unwrappedSearchParams.sort as SortOption)
    ? (unwrappedSearchParams.sort as SortOption)
    : "default";

  // Parse the slug to get search parameters
  const parsedParams = parseSearchSlug(slugString);

  // Destructure search parameters
  const {
    location = "",
    propertyType = "any",
    bedrooms = "any",
    bathrooms = "any",
    status = "for-sale",
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    isOportunidad,
  } = parsedParams;

  // Build search filters
  const searchFilters: SearchFilters = {
    location: location || undefined,
    propertyType: propertyType === "any" ? undefined : propertyType,
    status: status as "for-sale" | "for-rent",
    bedrooms: bedrooms === "any" ? undefined : parseInt(bedrooms),
    bathrooms: bathrooms === "any" ? undefined : parseInt(bathrooms),
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    isOportunidad,
  };

  // Get data for search bar
  const accountId = BigInt(env.NEXT_PUBLIC_ACCOUNT_ID);
  const [cities, priceRange, listings, watermarkConfig] = await Promise.all([
    getCities(accountId),
    getPriceRange(accountId),
    searchListings(searchFilters, 50, sort),
    getWatermarkConfig(),
  ]);

  const watermarkEnabled = watermarkConfig.enabled && !!watermarkConfig.logoUrl;

  // Hardcoded property types
  const propertyTypes = ["piso", "casa", "local", "solar", "garaje", "edificio", "oficina", "industrial", "trastero"];

  // Ensure priceRange has valid numbers
  const validPriceRange = {
    minPrice: typeof priceRange.minPrice === "number" ? priceRange.minPrice : 0,
    maxPrice:
      typeof priceRange.maxPrice === "number" ? priceRange.maxPrice : 2000000,
  };

  // Build title of the search
  let searchTitle = "Propiedades";

  if (status === "for-rent") {
    searchTitle = "Propiedades en Alquiler";
  } else if (status === "for-sale") {
    searchTitle = "Propiedades en Venta";
  }

  if (propertyType !== "any") {
    const propertyTypeLabels: Record<Exclude<PropertyType, "any">, string> = {
      piso: status === "for-rent" ? "Pisos en Alquiler" : "Pisos en Venta",
      casa: status === "for-rent" ? "Casas en Alquiler" : "Casas en Venta",
      local: status === "for-rent" ? "Locales en Alquiler" : "Locales en Venta",
      solar: "Solares en Venta",
      garaje: status === "for-rent" ? "Garajes en Alquiler" : "Garajes en Venta",
      edificio: status === "for-rent" ? "Edificios en Alquiler" : "Edificios en Venta",
      oficina: status === "for-rent" ? "Oficinas en Alquiler" : "Oficinas en Venta",
      industrial: status === "for-rent" ? "Naves Industriales en Alquiler" : "Naves Industriales en Venta",
      trastero: status === "for-rent" ? "Trasteros en Alquiler" : "Trasteros en Venta",
    };

    if (propertyType in propertyTypeLabels) {
      searchTitle = propertyTypeLabels[propertyType];
    }
  }

  // Add "Oportunidad" suffix if filtering by oportunidad
  if (isOportunidad) {
    searchTitle += " - Oportunidad";
  }

  if (location && location !== "todas-ubicaciones") {
    const locationName = decodeURIComponent(location.replace(/-/g, " "));
    const capitalizedLocationName =
      locationName.charAt(0).toUpperCase() + locationName.slice(1);
    searchTitle += ` en ${capitalizedLocationName}`;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="py-4" aria-label="Breadcrumb">
          <ol className="flex items-center text-sm">
            <li>
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary"
              >
                Inicio
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="font-medium" aria-current="page">
              {searchTitle}
            </li>
          </ol>
        </nav>

        <div className="mb-8 mt-8">
          <SearchBar
            initialParams={parsedParams}
            cities={cities}
            propertyTypes={propertyTypes}
            priceRange={validPriceRange}
            accountId={env.NEXT_PUBLIC_ACCOUNT_ID}
          />
        </div>

        <div className="mb-8 flex items-center justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>

          <SortDropdown slugString={slugString} currentSort={sort} />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">{searchTitle}</h1>
          <p className="text-muted-foreground">
            {listings.length} propiedades encontradas
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Suspense
            fallback={Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          >
            {listings.map((listing, index) => (
              <PropertyCard
                key={listing.listingId.toString()}
                listing={listing}
                index={index}
                watermarkEnabled={watermarkEnabled}
              />
            ))}
          </Suspense>
        </div>
      </div>
      <Footer />
    </main>
  );
}
