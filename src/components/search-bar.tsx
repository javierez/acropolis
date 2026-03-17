"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { buildSearchSlug, type SearchParams, type PropertyType } from "~/lib/search-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  TwoLevelLocationSelect,
  type CityOption,
} from "~/components/ui/two-level-location-select";

interface SearchBarProps {
  initialParams?: SearchParams;
  cities: CityOption[];
  propertyTypes: string[];
  priceRange: { minPrice: number; maxPrice: number };
  accountId: string;
}

export function SearchBar({
  initialParams,
  cities,
  propertyTypes,
  priceRange: _dbPriceRange,
  accountId,
}: SearchBarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize state with provided params or defaults
  const [searchMode, setSearchMode] = useState<"for-sale" | "for-rent">(
    (initialParams?.status as "for-sale" | "for-rent") ?? "for-sale",
  );
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("all");
  const [propertyType, setPropertyType] = useState<PropertyType>(
    initialParams?.propertyType ?? "any",
  );
  const [minPrice, setMinPrice] = useState<string>(
    initialParams?.minPrice ? initialParams.minPrice.toString() : "",
  );
  const [maxPrice, setMaxPrice] = useState<string>(
    initialParams?.maxPrice ? initialParams.maxPrice.toString() : "",
  );
  const [bedrooms, setBedrooms] = useState<string>(
    initialParams?.bedrooms ?? "any",
  );
  const [bathrooms, setBathrooms] = useState<string>(
    initialParams?.bathrooms ?? "any",
  );
  const [minArea, setMinArea] = useState<string>(
    initialParams?.minArea ? initialParams.minArea.toString() : "",
  );
  const [maxArea, setMaxArea] = useState<string>(
    initialParams?.maxArea ? initialParams.maxArea.toString() : "",
  );

  // Parse initial location if provided
  useEffect(() => {
    if (
      initialParams?.location &&
      initialParams.location !== "todas-ubicaciones"
    ) {
      const locationParts = initialParams.location.split("-");
      if (locationParts.length === 2) {
        setCity(locationParts[0] || "");
        setNeighborhood(locationParts[1] || "all");
      } else {
        setCity(initialParams.location);
        setNeighborhood("all");
      }
    }
  }, [initialParams?.location]);

  // Update state when initialParams change
  useEffect(() => {
    if (initialParams) {
      if (initialParams.status)
        setSearchMode(initialParams.status as "for-sale" | "for-rent");
      if (initialParams.propertyType)
        setPropertyType(initialParams.propertyType);
      if (initialParams.minPrice)
        setMinPrice(initialParams.minPrice.toString());
      if (initialParams.maxPrice)
        setMaxPrice(initialParams.maxPrice.toString());
      if (initialParams.bedrooms) setBedrooms(initialParams.bedrooms);
      if (initialParams.bathrooms) setBathrooms(initialParams.bathrooms);
      if (initialParams.minArea) setMinArea(initialParams.minArea.toString());
      if (initialParams.maxArea) setMaxArea(initialParams.maxArea.toString());
    }
  }, [initialParams]);

  // Build location string from city and neighborhood
  const buildLocation = () => {
    if (!city) return undefined;
    return neighborhood && neighborhood !== "all"
      ? `${city}-${neighborhood}`
      : city;
  };

  // Handle search mode change
  const handleSearchModeChange = (value: string) => {
    const newMode = value === "comprar" ? "for-sale" : "for-rent";
    setSearchMode(newMode);
  };

  // Handle property type change
  const handlePropertyTypeChange = (value: PropertyType) => {
    setPropertyType(value);
  };

  const handleSearch = () => {
    const location = buildLocation();
    const searchParams: SearchParams = {
      location,
      propertyType: propertyType === "any" ? undefined : propertyType,
      bedrooms: bedrooms === "any" ? undefined : bedrooms,
      bathrooms: bathrooms === "any" ? undefined : bathrooms,
      minPrice: minPrice ? Number.parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? Number.parseInt(maxPrice) : undefined,
      minArea: minArea ? Number.parseInt(minArea) : undefined,
      maxArea: maxArea ? Number.parseInt(maxArea) : undefined,
      status: searchMode,
    };

    const searchSlug = buildSearchSlug(searchParams);
    router.push(`/${searchSlug}`);
  };

  return (
    <div className="relative z-10 mx-auto -mt-8 w-full max-w-6xl rounded-lg bg-white p-4 shadow-lg sm:p-6">
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6">
        <div>
          <Label htmlFor="operation" className="text-sm font-medium">
            Operación
          </Label>
          {mounted ? (
            <Select
              value={searchMode === "for-sale" ? "comprar" : "alquilar"}
              onValueChange={handleSearchModeChange}
            >
              <SelectTrigger id="operation">
                <SelectValue placeholder="Seleccionar operación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprar">Comprar</SelectItem>
                <SelectItem value="alquilar">Alquilar</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 text-sm">
              {searchMode === "for-sale" ? "Comprar" : "Alquilar"}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="property-type" className="text-sm font-medium">
            Tipo inmueble
          </Label>
          {mounted ? (
            <Select value={propertyType} onValueChange={handlePropertyTypeChange}>
              <SelectTrigger id="property-type">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquier tipo</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 text-sm">
              {propertyType === "any" ? "Cualquier tipo" : propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
            </div>
          )}
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <Label className="text-sm font-medium">Ubicación</Label>
          {mounted ? (
            <TwoLevelLocationSelect
              cities={cities}
              accountId={accountId}
              selectedCity={city}
              selectedNeighborhood={neighborhood}
              onCityChange={setCity}
              onNeighborhoodChange={setNeighborhood}
              cityPlaceholder="Selecciona ciudad..."
              neighborhoodPlaceholder="Selecciona barrio..."
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 text-sm text-muted-foreground">
                Selecciona ciudad...
              </div>
              <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 text-sm text-muted-foreground">
                Selecciona barrio...
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="bedrooms" className="text-sm font-medium">
            Habitaciones
          </Label>
          {mounted ? (
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger id="bedrooms">
                <SelectValue placeholder="Habitaciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquiera</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 text-sm">
              {bedrooms === "any" ? "Cualquiera" : `${bedrooms}+`}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="bathrooms" className="text-sm font-medium">
            Baños
          </Label>
          {mounted ? (
            <Select value={bathrooms} onValueChange={setBathrooms}>
              <SelectTrigger id="bathrooms">
                <SelectValue placeholder="Baños" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquiera</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 text-sm">
              {bathrooms === "any" ? "Cualquiera" : `${bathrooms}+`}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        <div>
          <Label className="text-sm font-medium">Superficie</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Desde"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Hasta"
                value={maxArea}
                onChange={(e) => setMaxArea(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">
            {searchMode === "for-rent"
              ? "Precio de alquiler"
              : "Precio de venta"}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Desde"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Hasta"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center sm:justify-end">
        <Button
          onClick={handleSearch}
          className="w-full px-6 sm:w-auto sm:px-8"
        >
          Buscar
        </Button>
      </div>
    </div>
  );
}
