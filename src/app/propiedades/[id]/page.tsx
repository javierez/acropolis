import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getListingDetails,
  getPropertyImages,
} from "~/server/queries/listings";
import { getAccountInfo } from "~/server/queries/account";
import { getWatermarkConfig } from "~/server/queries/watermark";
import { env } from "~/env";
import { Badge } from "~/components/ui/badge";
import { Bed, Bath, SquareIcon, MapPin } from "lucide-react";
import { PropertyCard } from "~/components/property-card";
import { ContactSection } from "~/components/contact-section";
import Footer from "~/components/footer";
import { ImageGallery } from "~/components/property/image-gallery";
import { PropertyCharacteristics } from "~/components/property/property-characteristics";
import { PropertyLocationMap } from "~/components/property/property-location-map";
import { PropertyPageClient } from "./property-page-client";

interface PropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const unwrappedParams = await params;
  const listingId = parseInt(unwrappedParams.id);

  let property = null;
  let propertyImages = [];

  try {
    property = await getListingDetails(listingId);
    if (property) {
      propertyImages = await getPropertyImages(property.propertyId);
    }
  } catch (error) {
    console.error("Error fetching property for metadata:", error);
  }

  // Fetch website configuration from database
  const accountInfo = await getAccountInfo(env.NEXT_PUBLIC_ACCOUNT_ID);
  const companyName = accountInfo?.name || "Acropolis Bienes Raíces";

  if (!property) {
    return {
      title: `Propiedad no encontrada | ${companyName}`,
      description:
        "La propiedad que estás buscando no existe o ha sido eliminada.",
    };
  }

  return {
    title: `${property.title} | ${companyName}`,
    description: property.description || `Propiedad en ${property.city}`,
    openGraph: {
      title: `${property.title} | ${companyName}`,
      description: property.description || `Propiedad en ${property.city}`,
      images: [
        {
          url: propertyImages[0]?.imageUrl ?? "/properties/suburban-dream.png",
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const unwrappedParams = await params;
  const listingId = parseInt(unwrappedParams.id);

  let property = null;
  let propertyImages = [];

  try {
    property = await getListingDetails(listingId);
    if (property) {
      propertyImages = await getPropertyImages(property.propertyId);
    }
  } catch (error) {
    console.error("Error fetching property:", error);
    notFound();
  }

  // Fetch watermark configuration
  const watermarkConfig = await getWatermarkConfig();

  if (!property) {
    notFound();
  }

  // Transform database images to PropertyImage format
  const transformedImages = propertyImages.map((img: any) => ({
    id: img.propertyImageId,
    url: img.imageUrl,
    alt: `${property.title || "Property"} - Image ${img.imageOrder}`,
    tag: img.imageTag || undefined,
    originImageId: img.originImageId || null,
  }));

  // Create features array from database fields
  const features = [];
  if (property.hasElevator) features.push("Ascensor");
  if (property.hasGarage) features.push("Garaje");
  if (property.hasStorageRoom) features.push("Trastero");
  if (property.hasHeating) features.push("Calefacción");
  if (property.airConditioningType) features.push("Aire acondicionado");
  if (property.terrace) features.push("Terraza");
  if (property.garden) features.push("Jardín");
  if (property.pool) features.push("Piscina");
  if (property.bright) features.push("Luminoso");
  if (property.exterior) features.push("Exterior");

  // Debug: log the property data to see what we're working with
  console.log("Property data fields:", Object.keys(property));
  console.log("Property images count:", propertyImages.length);
  console.log("Generated features:", features);
  console.log("Energy Certificate Data:", {
    energyCertification: property.energyCertification,
    energyCertificateStatus: property.energyCertificateStatus,
    energyConsumptionScale: property.energyConsumptionScale,
    energyConsumptionValue: property.energyConsumptionValue,
    emissionsScale: property.emissionsScale,
    emissionsValue: property.emissionsValue,
  });

  // Get similar properties (same city or type) - for now just return empty array
  // TODO: Implement similar properties query
  const similarProperties: any[] = [];

  const getEnergyCertificationColor = (cert: string | null | undefined) => {
    if (!cert) return "bg-gray-300";

    switch (cert) {
      case "A":
        return "bg-green-500";
      case "B":
        return "bg-green-400";
      case "C":
        return "bg-yellow-400";
      case "D":
        return "bg-yellow-500";
      case "E":
        return "bg-orange-400";
      case "F":
        return "bg-orange-500";
      case "G":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  // Function to clean up title by removing numbers before neighborhood
  const cleanTitle = (title: string | null) => {
    if (!title) return "Propiedad";
    // Remove pattern like "123 " at the beginning or " 123 " before neighborhood
    // Also remove comma before numbers like ", 123"
    return title
      .replace(/,\s*\d+/g, "") // Remove comma followed by number
      .replace(/\s+\d+\s+/g, " ") // Remove number with spaces
      .replace(/^\d+\s+/, "") // Remove number at beginning
      .trim();
  };

  // Map coordinates from database or default to León, Spain coordinates
  const mapCoordinates = {
    lat: Number(property.latitude) || 42.5987,
    lng: Number(property.longitude) || -5.5671,
  };

  // Format address based on location visibility setting
  // 1 = Exact (full address), 2 = Street (no number), 3 = Zone (no street)
  const getFormattedAddress = () => {
    const visibility = property.fcLocationVisibility ?? 1;
    const street = property.street;

    // Remove street number from street name
    const streetWithoutNumber = street
      ?.replace(/,?\s*\d+[A-Za-z]?\s*$/g, "") // Remove number at end (e.g., ", 5" or " 12B")
      ?.replace(/^\d+[A-Za-z]?\s*,?\s*/g, "") // Remove number at start (e.g., "5, " or "12B ")
      ?.trim();

    const parts: (string | null | undefined)[] = [];

    if (visibility === 1) {
      // Exact: show full address
      parts.push(street, property.city, property.province, property.postalCode);
    } else if (visibility === 2) {
      // Street: show street name without number
      parts.push(streetWithoutNumber, property.city, property.province, property.postalCode);
    } else {
      // Zone: show only city/province (no street)
      parts.push(property.city, property.province);
    }

    return parts.filter(Boolean).join(", ");
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mt-2 py-4" aria-label="Breadcrumb">
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
            <li>
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary"
              >
                Propiedades
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="font-medium" aria-current="page">
              {cleanTitle(property.title)}
            </li>
          </ol>
        </nav>

        {/* Encabezado de la propiedad */}
        <div className="py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {cleanTitle(property.title)}
              </h1>
              <div className="mt-2 flex items-center text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                <p>{getFormattedAddress()}</p>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Ref: {property.referenceNumber || "N/A"}
              </div>
            </div>
            <div className="flex flex-col md:items-end">
              <div className="text-3xl font-bold">
                {(() => {
                  const price = property.price;
                  if (!price || price === "0" || price === 0) {
                    return "Precio a consultar";
                  }
                  try {
                    return Number(price).toLocaleString("es-ES");
                  } catch {
                    return "Precio a consultar";
                  }
                })()}
                €
                {property.listingType === "Rent" ||
                property.listingType === "RentWithOption"
                  ? "/mes"
                  : ""}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge>
                  {property.listingType === "Sale"
                    ? "En Venta"
                    : property.listingType === "Rent" ||
                        property.listingType === "RentWithOption"
                      ? "En Alquiler"
                      : property.status}
                </Badge>
                {property.isBankOwned && (
                  <Badge
                    variant="outline"
                    className="border-0 bg-amber-50/80 text-amber-800 shadow-md backdrop-blur-sm"
                  >
                    Piso de Banco
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Galería de imágenes */}
        <div className="pb-8">
          <ImageGallery
            images={transformedImages}
            title={property.title || "Property"}
            watermarkConfig={watermarkConfig}
          />
        </div>

        {/* Contenido principal */}
        <div className="pb-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Columna principal */}
            <div className="space-y-8 lg:col-span-2">
              {/* Características principales - Only show if at least one value exists */}
              {((property.bedrooms && property.bedrooms > 0) ||
                (property.bathrooms && property.bathrooms > 0) ||
                (property.squareMeter && property.squareMeter > 0)) && (
                <div className="grid gap-4 rounded-lg bg-muted p-6" style={{
                  gridTemplateColumns: `repeat(${[
                    property.bedrooms && property.bedrooms > 0,
                    property.bathrooms && property.bathrooms > 0,
                    property.squareMeter && property.squareMeter > 0
                  ].filter(Boolean).length}, 1fr)`
                }}>
                  {property.bedrooms && property.bedrooms > 0 && (
                    <div className="flex flex-col items-center text-center">
                      <Bed className="mb-2 h-8 w-8 text-primary" />
                      <span className="font-bold">{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && property.bathrooms > 0 && (
                    <div className="flex flex-col items-center text-center">
                      <Bath className="mb-2 h-8 w-8 text-primary" />
                      <span className="font-bold">
                        {Math.floor(Number(property.bathrooms))}
                      </span>
                    </div>
                  )}
                  {property.squareMeter && property.squareMeter > 0 && (
                    <div className="flex flex-col items-center text-center">
                      <SquareIcon className="mb-2 h-8 w-8 text-primary" />
                      <span className="font-bold">
                        {Number(property.squareMeter).toLocaleString("es-ES")} m²
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Descripción - Only show if description exists */}
              {property.description && (
                <div>
                  <h2 className="mb-4 text-2xl font-bold">Descripción</h2>
                  <p className="whitespace-pre-line text-muted-foreground">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Características */}
              <PropertyCharacteristics property={property} />

              {/* Enhanced Energy Certificate - Only show for properties that require it */}
              {property.propertyType !== "solar" &&
               property.propertyType !== "garaje" && (
                <div>
                <h2 className="mb-6 text-2xl font-bold">
                  Certificación Energética
                </h2>
                {property.energyConsumptionScale || property.emissionsScale ? (
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Energy Consumption Scale */}
                    <div className="space-y-4">
                      <h3 className="text-center text-lg font-semibold">
                        Eficiencia de Consumo
                      </h3>
                      <div className="rounded-lg border bg-white p-4">
                        <div className="space-y-1">
                          {["A", "B", "C", "D", "E", "F", "G"].map((rating) => {
                            const isCurrentRating =
                              property.energyConsumptionScale?.toUpperCase() ===
                              rating;
                            const backgroundColor =
                              getEnergyCertificationColor(rating);
                            const arrowWidth =
                              {
                                A: "w-32",
                                B: "w-36",
                                C: "w-40",
                                D: "w-44",
                                E: "w-48",
                                F: "w-52",
                                G: "w-56",
                              }[rating] || "w-40";

                            return (
                              <div key={rating} className="relative flex">
                                <div
                                  className={`flex h-8 items-center justify-start px-3 text-sm font-bold ${
                                    isCurrentRating
                                      ? `${backgroundColor} text-white ring-2 ring-blue-500 ring-offset-2`
                                      : "bg-gray-200 text-gray-600"
                                  } ${rating === "A" ? "rounded-tl-lg" : ""} ${rating === "G" ? "rounded-bl-lg" : ""} ${arrowWidth}`}
                                  style={{
                                    clipPath:
                                      "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
                                  }}
                                >
                                  <span>
                                    {rating}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {property.energyConsumptionValue && (
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            Consumo: {property.energyConsumptionValue} kWh/m²
                            año
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Energy Emissions Scale */}
                    <div className="space-y-4">
                      <h3 className="text-center text-lg font-semibold">
                        Eficiencia de Emisiones
                      </h3>
                      <div className="rounded-lg border bg-white p-4">
                        <div className="space-y-1">
                          {["A", "B", "C", "D", "E", "F", "G"].map((rating) => {
                            const isCurrentRating =
                              property.emissionsScale?.toUpperCase() === rating;
                            const backgroundColor =
                              getEnergyCertificationColor(rating);
                            const arrowWidth =
                              {
                                A: "w-32",
                                B: "w-36",
                                C: "w-40",
                                D: "w-44",
                                E: "w-48",
                                F: "w-52",
                                G: "w-56",
                              }[rating] || "w-40";

                            return (
                              <div key={rating} className="relative flex">
                                <div
                                  className={`flex h-8 items-center justify-start px-3 text-sm font-bold ${
                                    isCurrentRating
                                      ? `${backgroundColor} text-white ring-2 ring-blue-500 ring-offset-2`
                                      : "bg-gray-200 text-gray-600"
                                  } ${rating === "A" ? "rounded-tl-lg" : ""} ${rating === "G" ? "rounded-bl-lg" : ""} ${arrowWidth}`}
                                  style={{
                                    clipPath:
                                      "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
                                  }}
                                >
                                  <span>
                                    {rating}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {property.emissionsValue && (
                        <div className="text-center">
                          <p className="text-sm font-medium">
                            Emisiones: {property.emissionsValue} kg CO₂/m² año
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Energy Consumption Scale - No color */}
                    <div className="space-y-4">
                      <h3 className="text-center text-lg font-semibold">
                        Eficiencia de Consumo
                      </h3>
                      <div className="rounded-lg border bg-white p-4">
                        <div className="space-y-1">
                          {["A", "B", "C", "D", "E", "F", "G"].map((rating) => {
                            const arrowWidth =
                              {
                                A: "w-32",
                                B: "w-36",
                                C: "w-40",
                                D: "w-44",
                                E: "w-48",
                                F: "w-52",
                                G: "w-56",
                              }[rating] || "w-40";

                            return (
                              <div key={rating} className="relative flex">
                                <div
                                  className={`flex h-8 items-center justify-start bg-gray-300 px-3 text-sm font-bold ${rating === "A" ? "rounded-tl-lg" : ""} ${rating === "G" ? "rounded-bl-lg" : ""} ${arrowWidth}`}
                                  style={{
                                    clipPath:
                                      "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
                                  }}
                                >
                                  <span className="text-gray-700">
                                    {rating}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Información no disponible
                        </p>
                      </div>
                    </div>

                    {/* Energy Emissions Scale - No color */}
                    <div className="space-y-4">
                      <h3 className="text-center text-lg font-semibold">
                        Eficiencia de Emisiones
                      </h3>
                      <div className="rounded-lg border bg-white p-4">
                        <div className="space-y-1">
                          {["A", "B", "C", "D", "E", "F", "G"].map((rating) => {
                            const arrowWidth =
                              {
                                A: "w-32",
                                B: "w-36",
                                C: "w-40",
                                D: "w-44",
                                E: "w-48",
                                F: "w-52",
                                G: "w-56",
                              }[rating] || "w-40";

                            return (
                              <div key={rating} className="relative flex">
                                <div
                                  className={`flex h-8 items-center justify-start bg-gray-300 px-3 text-sm font-bold ${rating === "A" ? "rounded-tl-lg" : ""} ${rating === "G" ? "rounded-bl-lg" : ""} ${arrowWidth}`}
                                  style={{
                                    clipPath:
                                      "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
                                  }}
                                >
                                  <span className="text-gray-700">
                                    {rating}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Información no disponible
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              )}

              {/* Mapa */}
              <div>
                <h2 className="mb-4 text-2xl font-bold">Ubicación</h2>
                <div className="aspect-[16/9] w-full overflow-hidden rounded-lg">
                  <PropertyLocationMap
                    lat={mapCoordinates.lat}
                    lng={mapCoordinates.lng}
                    locationVisibility={property.fcLocationVisibility}
                  />
                </div>
              </div>
            </div>

            {/* Barra lateral */}
            <PropertyPageClient property={property} />
          </div>
        </div>

        {/* Propiedades similares - Only show if there are similar properties */}
        {similarProperties.length > 0 && (
          <div className="py-16">
            <h2 className="mb-8 text-2xl font-bold">Propiedades Similares</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similarProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ContactSection />
      </div>
      <Footer />
    </>
  );
}
