"use client";

import * as React from "react";
import { ChevronDown, Search, Check, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { getNeighborhoodsByCity } from "~/server/actions/locations";

export interface CityOption {
  city: string;
  province: string;
}

export interface LocationOption {
  neighborhoodId: bigint;
  city: string;
  province: string;
  municipality: string;
  neighborhood: string;
}

interface TwoLevelLocationSelectProps {
  cities: CityOption[];
  accountId: string;
  selectedCity?: string;
  selectedNeighborhood?: string;
  onCityChange: (city: string) => void;
  onNeighborhoodChange: (neighborhoodId: string) => void;
  cityPlaceholder?: string;
  neighborhoodPlaceholder?: string;
}

interface SearchableSelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onSelect: (value: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

function SearchableSelect({
  options,
  value,
  onSelect,
  placeholder,
  searchPlaceholder = "Buscar...",
  disabled = false,
  loading = false,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    if (!search) return options;
    const lower = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(lower));
  }, [options, search]);

  const selectedLabel = options.find((o) => o.value === value)?.label;

  // Close on outside click
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

  // Focus search input when opening
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
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
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

export function TwoLevelLocationSelect({
  cities,
  accountId,
  selectedCity,
  selectedNeighborhood,
  onCityChange,
  onNeighborhoodChange,
  cityPlaceholder = "Selecciona una ciudad...",
  neighborhoodPlaceholder = "Selecciona un barrio...",
}: TwoLevelLocationSelectProps) {
  const [neighborhoods, setNeighborhoods] = React.useState<LocationOption[]>(
    [],
  );
  const [loadingNeighborhoods, setLoadingNeighborhoods] = React.useState(false);

  const cityOptions = React.useMemo(() => {
    return [
      { value: "all", label: "Todas las ciudades" },
      ...cities.map((city) => ({
        value: `${city.city}|${city.province}`,
        label: `${city.city}, ${city.province}`,
      })),
    ];
  }, [cities]);

  const neighborhoodOptions = React.useMemo(() => {
    return [
      { value: "all", label: "Toda la ciudad" },
      ...neighborhoods.map((n) => ({
        value: n.neighborhoodId.toString(),
        label: n.neighborhood,
      })),
    ];
  }, [neighborhoods]);

  const cityValue =
    selectedCity === "" || !selectedCity
      ? "all"
      : `${selectedCity}|${cities.find((c) => c.city === selectedCity)?.province || ""}`;

  const handleCitySelect = async (cityValue: string) => {
    if (cityValue === "all") {
      onCityChange("");
      onNeighborhoodChange("all");
      setNeighborhoods([]);
      return;
    }

    const city = cityValue.split("|")[0] ?? "";
    onCityChange(city);
    onNeighborhoodChange("all");

    if (city) {
      setLoadingNeighborhoods(true);
      try {
        const cityNeighborhoods = await getNeighborhoodsByCity(city, BigInt(accountId));
        setNeighborhoods(cityNeighborhoods);
      } catch (error) {
        console.error("Error loading neighborhoods:", error);
        setNeighborhoods([]);
      } finally {
        setLoadingNeighborhoods(false);
      }
    } else {
      setNeighborhoods([]);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <SearchableSelect
        options={cityOptions}
        value={cityValue}
        onSelect={handleCitySelect}
        placeholder={cityPlaceholder}
        searchPlaceholder="Buscar ciudad..."
      />
      <SearchableSelect
        options={neighborhoodOptions}
        value={selectedNeighborhood}
        onSelect={onNeighborhoodChange}
        placeholder={
          !selectedCity
            ? "Primero selecciona ciudad"
            : loadingNeighborhoods
              ? "Cargando barrios..."
              : neighborhoodPlaceholder
        }
        searchPlaceholder="Buscar barrio..."
        disabled={!selectedCity || loadingNeighborhoods}
        loading={loadingNeighborhoods}
      />
    </div>
  );
}
