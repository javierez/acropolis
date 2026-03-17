"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { buildSearchSlug, type SearchParams } from "~/lib/search-utils";
import {
  TwoLevelLocationSelect,
  type CityOption,
} from "~/components/ui/two-level-location-select";
import { staggerContainer, staggerItem } from "~/lib/animations";

type PropertyType = "any" | "piso" | "casa" | "local" | "solar" | "garaje";

interface SearchFormData {
  city: string;
  neighborhood: string;
  propertyType: PropertyType;
  bedrooms: string;
  bathrooms: string;
  status: "for-sale" | "for-rent";
}

interface PropertySearchProps {
  cities: CityOption[];
  propertyTypes: string[];
  priceRange: { minPrice: number; maxPrice: number };
  accountId: string;
}

export function PropertySearch({
  cities,
  propertyTypes,
  priceRange: dbPriceRange,
  accountId,
}: PropertySearchProps) {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState<number[]>([
    dbPriceRange.minPrice || 50000,
    dbPriceRange.maxPrice || 1000000,
  ]);
  const [isPriceSliderTouched, setIsPriceSliderTouched] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchFormData>({
    city: "",
    neighborhood: "all",
    propertyType: "any",
    bedrooms: "any",
    bathrooms: "any",
    status: "for-sale",
  });


  const handleSelectChange = (name: keyof SearchFormData, value: string) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { city, neighborhood, propertyType, bedrooms, bathrooms, status } =
      searchParams;
    const location =
      neighborhood && neighborhood !== "all" ? `${city}-${neighborhood}` : city;
    const searchParamsData: SearchParams = {
      location,
      propertyType: propertyType === "any" ? undefined : propertyType,
      bedrooms,
      bathrooms,
      minPrice: isPriceSliderTouched ? (priceRange[0] ?? 0) : undefined,
      maxPrice: isPriceSliderTouched ? (priceRange[1] ?? 0) : undefined,
      status,
    };

    const searchSlug = buildSearchSlug(searchParamsData);
    router.push(`/${searchSlug}`);
  };

  // Format numbers consistently to avoid hydration issues
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("es-ES").format(num);
  };

  return (
    <motion.div 
      className="mx-auto max-w-5xl rounded-lg bg-background/95 p-4 shadow-lg backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.form
        className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
        onSubmit={handleSubmit}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* First Row */}
        <motion.div className="space-y-2" variants={staggerItem}>
          <Label htmlFor="status" className="text-sm font-medium">
            Operación
          </Label>
          <Select
            defaultValue={searchParams.status}
            onValueChange={(value) =>
              handleSelectChange("status", value as "for-sale" | "for-rent")
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Operación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="for-sale">Venta</SelectItem>
              <SelectItem value="for-rent">Alquiler</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div className="space-y-2" variants={staggerItem}>
          <Label htmlFor="property-type" className="text-sm font-medium">
            Tipo de Propiedad
          </Label>
          <Select
            defaultValue={searchParams.propertyType}
            onValueChange={(value) =>
              handleSelectChange("propertyType", value as PropertyType)
            }
          >
            <SelectTrigger id="property-type">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Cualquiera</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div className="space-y-2" variants={staggerItem}>
          <Label htmlFor="bedrooms" className="text-sm font-medium">
            Habitaciones
          </Label>
          <Select
            defaultValue={searchParams.bedrooms}
            onValueChange={(value) => handleSelectChange("bedrooms", value)}
          >
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
        </motion.div>

        <motion.div className="space-y-2" variants={staggerItem}>
          <Label htmlFor="bathrooms" className="text-sm font-medium">
            Baños
          </Label>
          <Select
            defaultValue={searchParams.bathrooms}
            onValueChange={(value) => handleSelectChange("bathrooms", value)}
          >
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
        </motion.div>

        {/* Second Row */}
        <motion.div className="col-span-2 space-y-2" variants={staggerItem}>
          <Label className="text-sm font-medium">Ubicación</Label>
          <TwoLevelLocationSelect
            cities={cities}
            accountId={accountId}
            selectedCity={searchParams.city}
            selectedNeighborhood={searchParams.neighborhood}
            onCityChange={(city) => handleSelectChange("city", city)}
            onNeighborhoodChange={(neighborhood) =>
              handleSelectChange("neighborhood", neighborhood)
            }
            cityPlaceholder="Selecciona ciudad..."
            neighborhoodPlaceholder="Selecciona barrio..."
          />
        </motion.div>

        <motion.div className="space-y-2" variants={staggerItem}>
          <div className="flex flex-col space-y-1 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <Label className="text-sm font-medium">Precio</Label>
            <span className="text-xs text-muted-foreground text-center sm:text-right">
              {formatNumber(priceRange[0] ?? 0)}€ -{" "}
              {formatNumber(priceRange[1] ?? 0)}€
            </span>
          </div>
          <Slider
            defaultValue={priceRange}
            min={dbPriceRange.minPrice || 0}
            max={dbPriceRange.maxPrice || 2000000}
            step={10000}
            onValueChange={(value) => {
              setPriceRange(value);
              setIsPriceSliderTouched(true);
            }}
            className="py-4"
          />
        </motion.div>

        <motion.div className="flex items-end" variants={staggerItem}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Button type="submit" className="w-full" size="lg">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </motion.div>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
