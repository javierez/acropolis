"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  Bed,
  Bath,
  SquareIcon as SquareFoot,
  MapPin,
  Building,
} from "lucide-react";
import type { Property } from "~/lib/data";
import { getWatermarkedImageUrl } from "~/lib/image-url";

interface PropertyCardProps {
  property: Property;
  watermarkEnabled?: boolean;
}

export function PropertyCard({ property, watermarkEnabled = false }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  console.log("PropertyCard title:", property.title);

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case "piso":
        return "Piso";
      case "casa":
        return "Casa";
      case "local":
        return "Local";
      case "solar":
        return "Solar";
      case "garaje":
        return "Garaje";
      case "house":
        return "Casa";
      case "apartment":
        return "Piso";
      case "condo":
        return "Piso";
      case "commercial":
        return "Local";
      default:
        return type;
    }
  };

  // Get primary and secondary images with proper fallbacks
  const defaultPlaceholder = "/properties/suburban-dream.png";
  const rawPrimaryImage =
    property.imageUrl && property.imageUrl !== ""
      ? property.imageUrl
      : defaultPlaceholder;
  const primaryImage = getWatermarkedImageUrl(rawPrimaryImage, watermarkEnabled) || defaultPlaceholder;

  // For secondary image, use the second image from the array or fall back to primary image
  const rawSecondaryImage = property.images?.[1]?.url ?? rawPrimaryImage;
  const secondaryImage = getWatermarkedImageUrl(rawSecondaryImage, watermarkEnabled) || primaryImage;

  // Format numbers consistently to avoid hydration issues
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(num);
  };

  return (
    <Card
      className="w-full overflow-hidden transition-all hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/propiedades/${property.id}`}>
          <div className="relative h-full w-full">
            <Image
              src={primaryImage || "/placeholder.svg"}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              unoptimized={watermarkEnabled}
            />
            <Image
              src={secondaryImage || "/placeholder.svg"}
              alt={`${property.title} - Vista alternativa`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
              unoptimized={watermarkEnabled}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
          </div>
        </Link>
        <Badge className="absolute right-2 top-2 z-10 text-xs sm:text-sm">
          {property.status === "for-sale"
            ? "En Venta"
            : property.status === "for-rent"
              ? "En Alquiler"
              : "Vendido"}
        </Badge>
        <Badge
          variant="outline"
          className="absolute left-2 top-2 z-10 bg-white/80 text-xs sm:text-sm"
        >
          {getPropertyTypeLabel(property.propertyType)}
        </Badge>
        {property.isBankOwned && (
          <Badge
            variant="outline"
            className="absolute bottom-2 left-2 z-10 border-0 bg-amber-50/80 text-[10px] text-amber-800 shadow-md backdrop-blur-sm sm:text-xs"
          >
            Piso de Banco
          </Badge>
        )}
      </div>

      <CardContent className="p-3 sm:p-4">
        <div className="mb-2 flex items-start justify-between">
          <Link
            href={`/propiedades/${property.id}`}
            className="transition-colors hover:text-primary"
          >
            <h3 className="line-clamp-1 text-base font-semibold sm:text-lg">
              {property.title}
            </h3>
          </Link>
          <p className="text-base font-bold sm:text-lg">
            {formatNumber(property.price)}€
            {property.status === "for-rent" ? "/mes" : ""}
          </p>
        </div>

        <div className="mb-3 flex items-center text-muted-foreground">
          <MapPin className="mr-1 h-3.5 w-3.5" />
          <p className="line-clamp-1 text-xs sm:text-sm">
            {property.address}, {property.city}, {property.state}{" "}
            {property.zipCode}
          </p>
        </div>

        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground sm:mb-4 sm:text-sm">
          {property.description}
        </p>

        <div className="flex justify-between gap-2">
          {property.propertyType !== "solar" &&
            property.propertyType !== "garaje" &&
            property.propertyType !== "local" && (
              <>
                <div className="flex items-center">
                  <Bed className="mr-1 h-4 w-4" />
                  <span className="text-xs sm:text-sm">
                    {property.bedrooms}{" "}
                    {property.bedrooms === 1 ? "Hab" : "Habs"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Bath className="mr-1 h-4 w-4" />
                  <span className="text-xs sm:text-sm">
                    {property.bathrooms}{" "}
                    {property.bathrooms === 1 ? "Baño" : "Baños"}
                  </span>
                </div>
              </>
            )}
          <div className="flex items-center">
            <SquareFoot className="mr-1 h-4 w-4" />
            <span className="text-xs sm:text-sm">
              {formatNumber(property.squareFeet)} m²
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center text-xs text-muted-foreground">
          <Building className="mr-1 h-3 w-3" />
          <span>Ref: {property.reference}</span>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 sm:p-4">
        <Link
          href={`/propiedades/${property.id}`}
          className="w-full text-center text-xs font-medium text-primary hover:underline sm:text-sm"
        >
          Ver Detalles
        </Link>
      </CardFooter>
    </Card>
  );
}
