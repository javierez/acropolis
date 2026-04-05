"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, Search, Check, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { toLocationKey } from "~/lib/location-normalization";
import { getCitiesAndNeighborhoodsByProvince } from "~/server/actions/locations";

export interface CityWithNeighborhoods {
  city: string;
  neighborhoods: { neighborhoodId: bigint; neighborhood: string }[];
}

interface TwoLevelLocationSelectProps {
  provinces: string[];
  accountId: string;
  selectedProvince?: string;
  selectedCity?: string;
  selectedNeighborhood?: string;
  onProvinceChange: (province: string) => void;
  onCityChange: (city: string) => void;
  onNeighborhoodChange: (neighborhoodId: string) => void;
  provincePlaceholder?: string;
  locationPlaceholder?: string;
}

// Simple searchable select for province dropdown
function SearchableSelect({
  options,
  value,
  onSelect,
  placeholder,
  searchPlaceholder = "Buscar...",
  disabled = false,
  loading = false,
}: {
  options: { value: string; label: string }[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    if (!search) return options;
    const searchKey = toLocationKey(search);
    return options.filter((o) => toLocationKey(o.label).includes(searchKey));
  }, [options, search]);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) setOpen(!open);
        }}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          !selectedLabel && "text-muted-foreground",
        )}
      >
        <span className="line-clamp-1">
          {loading ? "Cargando..." : selectedLabel || placeholder}
        </span>
        {loading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin opacity-50" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex h-9 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-center text-sm text-muted-foreground">
                Sin resultados
              </p>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSelect(option.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center truncate rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    value === option.value && "bg-accent",
                  )}
                >
                  {value === option.value && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// City + Neighborhood combined dropdown
function CityNeighborhoodSelect({
  citiesData,
  selectedCity,
  selectedNeighborhood,
  onCitySelect,
  onNeighborhoodSelect,
  placeholder,
  searchPlaceholder = "Buscar...",
  disabled = false,
  loading = false,
}: {
  citiesData: CityWithNeighborhoods[];
  selectedCity?: string;
  selectedNeighborhood?: string;
  onCitySelect: (city: string) => void;
  onNeighborhoodSelect: (city: string, neighborhoodId: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [expandedCities, setExpandedCities] = React.useState<Set<string>>(new Set());
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Determine display label
  const getSelectedLabel = () => {
    if (!selectedCity || selectedCity === "all") return null;
    if (selectedNeighborhood && selectedNeighborhood !== "all") {
      const cityData = citiesData.find((c) => c.city === selectedCity);
      const hood = cityData?.neighborhoods.find(
        (n) => n.neighborhoodId.toString() === selectedNeighborhood,
      );
      if (hood) return `${hood.neighborhood}, ${selectedCity}`;
    }
    return selectedCity;
  };

  const selectedLabel = getSelectedLabel();

  // For each city, determine if it should show as collapsed (no expandable neighborhoods)
  const shouldCollapse = (cityData: CityWithNeighborhoods) => {
    if (cityData.neighborhoods.length === 0) return true;
    if (cityData.neighborhoods.length === 1) {
      const hood = cityData.neighborhoods[0]!;
      if (
        hood.neighborhood.toLowerCase() === cityData.city.toLowerCase()
      )
        return true;
    }
    return false;
  };

  // Filter cities/neighborhoods by search
  const filteredData = React.useMemo(() => {
    if (!search) return citiesData;
    const searchKey = toLocationKey(search);
    return citiesData
      .map((cityData) => {
        const cityMatches = toLocationKey(cityData.city).includes(searchKey);
        const matchingNeighborhoods = cityData.neighborhoods.filter((n) =>
          toLocationKey(n.neighborhood).includes(searchKey),
        );
        if (cityMatches) return cityData;
        if (matchingNeighborhoods.length > 0) {
          return { ...cityData, neighborhoods: matchingNeighborhoods };
        }
        return null;
      })
      .filter(Boolean) as CityWithNeighborhoods[];
  }, [citiesData, search]);

  const toggleExpanded = (city: string) => {
    setExpandedCities((prev) => {
      const next = new Set(prev);
      if (next.has(city)) {
        next.delete(city);
      } else {
        next.add(city);
      }
      return next;
    });
  };

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) setOpen(!open);
        }}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          !selectedLabel && "text-muted-foreground",
        )}
      >
        <span className="line-clamp-1">
          {loading ? "Cargando..." : selectedLabel || placeholder}
        </span>
        {loading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin opacity-50" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex h-9 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {/* "All" option */}
            <button
              type="button"
              onClick={() => {
                onCitySelect("all");
                setOpen(false);
                setSearch("");
              }}
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center truncate rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                (!selectedCity || selectedCity === "all") && "bg-accent",
              )}
            >
              {(!selectedCity || selectedCity === "all") && (
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <Check className="h-4 w-4" />
                </span>
              )}
              Toda la provincia
            </button>

            {filteredData.length === 0 ? (
              <p className="px-3 py-2 text-center text-sm text-muted-foreground">
                Sin resultados
              </p>
            ) : (
              filteredData.map((cityData) => {
                const collapsed = shouldCollapse(cityData);
                const isExpanded = expandedCities.has(cityData.city);
                const isCitySelected =
                  selectedCity === cityData.city &&
                  (!selectedNeighborhood || selectedNeighborhood === "all");

                if (collapsed) {
                  // Simple selectable city row, no children
                  return (
                    <button
                      key={cityData.city}
                      type="button"
                      onClick={() => {
                        onCitySelect(cityData.city);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center truncate rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        isCitySelected && "bg-accent",
                      )}
                    >
                      {isCitySelected && (
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                      {cityData.city}
                    </button>
                  );
                }

                // City with expandable neighborhoods
                return (
                  <div key={cityData.city}>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(cityData.city)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm hover:bg-accent"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        ) : (
                          <ChevronRight className="h-3 w-3 opacity-50" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onCitySelect(cityData.city);
                          setOpen(false);
                          setSearch("");
                        }}
                        className={cn(
                          "relative flex flex-1 cursor-pointer select-none items-center truncate rounded-sm py-1.5 pl-4 pr-2 text-sm font-medium outline-none hover:bg-accent hover:text-accent-foreground",
                          isCitySelected && "bg-accent",
                        )}
                      >
                        {isCitySelected && (
                          <span className="absolute left-0 flex h-3.5 w-3.5 items-center justify-center">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                        {cityData.city}
                      </button>
                    </div>

                    {isExpanded &&
                      cityData.neighborhoods.map((hood) => {
                        const isHoodSelected =
                          selectedNeighborhood === hood.neighborhoodId.toString();
                        return (
                          <button
                            key={hood.neighborhoodId.toString()}
                            type="button"
                            onClick={() => {
                              onNeighborhoodSelect(
                                cityData.city,
                                hood.neighborhoodId.toString(),
                              );
                              setOpen(false);
                              setSearch("");
                            }}
                            className={cn(
                              "relative flex w-full cursor-pointer select-none items-center truncate rounded-sm py-1.5 pl-14 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                              isHoodSelected && "bg-accent",
                            )}
                          >
                            {isHoodSelected && (
                              <span className="absolute left-9 flex h-3.5 w-3.5 items-center justify-center">
                                <Check className="h-4 w-4" />
                              </span>
                            )}
                            {hood.neighborhood}
                          </button>
                        );
                      })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function TwoLevelLocationSelect({
  provinces,
  accountId,
  selectedProvince,
  selectedCity,
  selectedNeighborhood,
  onProvinceChange,
  onCityChange,
  onNeighborhoodChange,
  provincePlaceholder = "Selecciona provincia...",
  locationPlaceholder = "Selecciona ubicación...",
}: TwoLevelLocationSelectProps) {
  const [citiesData, setCitiesData] = React.useState<CityWithNeighborhoods[]>([]);
  const [loadingCities, setLoadingCities] = React.useState(false);

  const provinceOptions = React.useMemo(() => {
    return [
      { value: "all", label: "Todas las provincias" },
      ...provinces.map((p) => ({ value: p, label: p })),
    ];
  }, [provinces]);

  const handleProvinceSelect = async (province: string) => {
    if (province === "all") {
      onProvinceChange("");
      onCityChange("");
      onNeighborhoodChange("all");
      setCitiesData([]);
      return;
    }

    onProvinceChange(province);
    onCityChange("");
    onNeighborhoodChange("all");

    setLoadingCities(true);
    try {
      const data = await getCitiesAndNeighborhoodsByProvince(
        province,
        BigInt(accountId),
      );
      setCitiesData(data);
    } catch (error) {
      console.error("Error loading cities:", error);
      setCitiesData([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleCitySelect = (city: string) => {
    if (city === "all") {
      onCityChange("");
      onNeighborhoodChange("all");
    } else {
      onCityChange(city);
      onNeighborhoodChange("all");
    }
  };

  const handleNeighborhoodSelect = (city: string, neighborhoodId: string) => {
    onCityChange(city);
    onNeighborhoodChange(neighborhoodId);
  };

  const provinceValue =
    !selectedProvince || selectedProvince === "" ? "all" : selectedProvince;

  return (
    <div className="grid grid-cols-2 gap-2">
      <SearchableSelect
        options={provinceOptions}
        value={provinceValue}
        onSelect={handleProvinceSelect}
        placeholder={provincePlaceholder}
        searchPlaceholder="Buscar provincia..."
      />
      <CityNeighborhoodSelect
        citiesData={citiesData}
        selectedCity={selectedCity}
        selectedNeighborhood={selectedNeighborhood}
        onCitySelect={handleCitySelect}
        onNeighborhoodSelect={handleNeighborhoodSelect}
        placeholder={
          !selectedProvince
            ? "Primero selecciona provincia"
            : loadingCities
              ? "Cargando..."
              : locationPlaceholder
        }
        searchPlaceholder="Buscar ciudad o barrio..."
        disabled={!selectedProvince || loadingCities}
        loading={loadingCities}
      />
    </div>
  );
}
