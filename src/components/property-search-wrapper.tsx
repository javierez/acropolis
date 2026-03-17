import { getCities, getPriceRange } from "~/server/actions/locations";
import { PropertySearch } from "./property-search";
import { env } from "~/env";

export async function PropertySearchWrapper() {
  // Validate NEXT_PUBLIC_ACCOUNT_ID exists before converting to BigInt
  if (!env.NEXT_PUBLIC_ACCOUNT_ID) {
    throw new Error("NEXT_PUBLIC_ACCOUNT_ID is not defined in environment variables");
  }
  const accountId = BigInt(env.NEXT_PUBLIC_ACCOUNT_ID);
  const [cities, priceRange] = await Promise.all([
    getCities(accountId),
    getPriceRange(accountId),
  ]);

  // Hardcoded property types
  const propertyTypes = ["piso", "casa", "local", "solar", "garaje"];

  // Ensure priceRange has valid numbers
  const validPriceRange = {
    minPrice: typeof priceRange.minPrice === "number" ? priceRange.minPrice : 0,
    maxPrice:
      typeof priceRange.maxPrice === "number" ? priceRange.maxPrice : 2000000,
  };

  return (
    <PropertySearch
      cities={cities}
      propertyTypes={propertyTypes}
      priceRange={validPriceRange}
      accountId={env.NEXT_PUBLIC_ACCOUNT_ID}
    />
  );
}
