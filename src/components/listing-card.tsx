"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { Bed, Bath, SquareIcon as SquareFoot, MapPin } from "lucide-react";
import { formatPrice } from "~/lib/utils";
import type { ListingCardData } from "~/server/queries/listings";
import { getWatermarkedImageUrl } from "~/lib/image-url";

interface PropertyCardProps {
  listing: ListingCardData;
  index?: number;
  watermarkEnabled?: boolean;
}

const formatListingType = (type: string) => {
  switch (type) {
    case "Sale":
      return "Venta";
    case "Rent":
      return "Alquiler";
    case "RentWithOption":
      return "Alquiler";
    case "RoomSharing":
      return "Habitación";
    default:
      return type;
  }
};

export const PropertyCard = React.memo(function PropertyCard({
  listing,
  index = 0,
  watermarkEnabled = false,
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [image2Loaded, setImage2Loaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for triggering animation when visible
  useEffect(() => {
    if (!listing.isOportunidad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [listing.isOportunidad]);

  const getPropertyTypeLabel = (type: string | null) => {
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
      default:
        return type;
    }
  };

  // Get primary image with proper fallback
  const defaultPlaceholder = "/properties/suburban-dream.png";
  const [imageSrc, setImageSrc] = useState(
    getWatermarkedImageUrl(listing.imageUrl, watermarkEnabled) || defaultPlaceholder,
  );
  const [imageSrc2, setImageSrc2] = useState(
    getWatermarkedImageUrl(listing.imageUrl2 ?? listing.imageUrl, watermarkEnabled) || defaultPlaceholder,
  );


  const onImageError = () => {
    setImageSrc(defaultPlaceholder);
  };

  const onImage2Error = () => {
    setImageSrc2(defaultPlaceholder);
  };

  return (
    <Link
      href={`/propiedades/${listing.listingId.toString()}`}
      className="block"
    >
      <Card
        ref={cardRef}
        className={`flex h-full flex-col overflow-hidden transition-all hover:shadow-lg ${listing.isOportunidad && isVisible ? "animate-oportunidad" : ""}`}
        style={listing.isOportunidad && isVisible ? { animationDelay: `${index * 200}ms` } : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="relative h-full w-full">
            {/* First Image */}
            <Image
              src={imageSrc}
              alt={listing.title ?? "Property image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-300 ${
                isHovered ? "opacity-0" : "opacity-100"
              } ${imageSrc === defaultPlaceholder || listing.status === "Sold" || listing.status === "Vendido" ? "grayscale" : ""}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={onImageError}
              quality={75}
              unoptimized={watermarkEnabled}
            />
            {/* Second Image */}
            <Image
              src={imageSrc2}
              alt={listing.title ?? "Property image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              } ${imageSrc2 === defaultPlaceholder || listing.status === "Sold" || listing.status === "Vendido" ? "grayscale" : ""}`}
              loading="lazy"
              onLoad={() => setImage2Loaded(true)}
              onError={onImage2Error}
              quality={75}
              unoptimized={watermarkEnabled}
            />
            {(!imageLoaded || !image2Loaded) && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
          </div>
          {/* Top Left - Property Type */}
          <Badge
            variant="outline"
            className="absolute left-2 top-2 z-10 bg-white/80 text-sm"
          >
            {getPropertyTypeLabel(listing.propertyType)}
          </Badge>

          {/* Top Right - Status */}
          <Badge className="absolute right-2 top-2 z-10 text-sm">
            {formatListingType(listing.listingType)}
          </Badge>

          {/* Vendido / Alquilado overlay sticker */}
          {(listing.status === "Vendido" || listing.status === "Alquilado") && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <span className="rotate-[-15deg] rounded bg-red-600/90 px-4 py-1.5 text-lg font-bold uppercase tracking-wider text-white shadow-lg">
                {listing.status}
              </span>
            </div>
          )}

          {/* Bottom Center - Bank Owned (above reference) */}
          {listing.isBankOwned && (
            <Badge
              variant="outline"
              className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 border-0 bg-amber-50/80 text-[10px] text-amber-800 shadow-md backdrop-blur-sm"
            >
              Piso de Banco
            </Badge>
          )}

          {/* Bottom Center - Reference Number */}
          <div className="absolute bottom-1 left-1/2 z-10 -translate-x-1/2">
            <span className="text-[10px] font-semibold tracking-widest text-white/90">
              {listing.referenceNumber ?? ""}
            </span>
          </div>

          {/* Bottom Right - Oportunidad indicator */}
          {listing.isOportunidad && (
            <Badge className="absolute bottom-2 right-2 z-10 border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-sm text-white shadow-md">
              Oportunidad
            </Badge>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col p-3">
          <div className="mb-1 flex items-start justify-between">
            <div>
              <h3 className="line-clamp-1 text-base font-semibold">
                {listing.title || listing.street}
              </h3>
            </div>
            <p className="text-base font-bold">
              {formatPrice(listing.price)}€
              {["Rent", "RentWithOption", "RoomSharing"].includes(
                listing.listingType,
              )
                ? "/mes"
                : ""}
            </p>
          </div>

          <div className="mb-2 flex items-center text-muted-foreground">
            <MapPin className="mr-1 h-3.5 w-3.5" />
            <p className="line-clamp-1 text-xs">
              {listing.city}, {listing.province}
            </p>
          </div>

          <p className="mb-3 line-clamp-3 flex-1 text-xs text-muted-foreground sm:mb-4 sm:text-sm">
            {listing.description ||
              `${getPropertyTypeLabel(listing.propertyType)} de ${listing.squareMeter || (listing.builtSurfaceArea ? Math.round(Number(listing.builtSurfaceArea)) : 0)} m² con ${listing.bedrooms} habitaciones`}
          </p>

          <div className="mt-auto flex justify-between text-xs">
            {listing.propertyType !== "solar" &&
              listing.propertyType !== "garaje" &&
              listing.propertyType !== "local" && (
                <>
                  <div className="flex items-center">
                    <Bed className="mr-1 h-5 w-5" />
                    <span>
                      {listing.bedrooms}{" "}
                      {listing.bedrooms === 1 ? "Hab" : "Habs"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="mr-1 h-5 w-5" />
                    <span>
                      {Math.floor(Number(listing.bathrooms))}{" "}
                      {Math.floor(Number(listing.bathrooms)) === 1
                        ? "Baño"
                        : "Baños"}
                    </span>
                  </div>
                </>
              )}
            <div className="flex items-center">
              <SquareFoot className="mr-1 h-5 w-5" />
              <span>{listing.squareMeter || (listing.builtSurfaceArea ? Math.round(Number(listing.builtSurfaceArea)) : 0)} m²</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
