"use server";

import { db } from "~/server/db";
import { locations, listings, properties } from "~/server/db/schema";
import { sql, min, max, eq, and, or, notInArray } from "drizzle-orm";

/**
 * Reusable listing visibility condition for website queries.
 * - Excludes 'Draft' and 'Descartado' always
 * - Includes 'Vendido'/'Alquilado' only if updatedAt is within the last 2 weeks
 */
function websiteVisibleStatus() {
  return or(
    // Active statuses (not sold/rented/discarded/draft)
    notInArray(listings.status, ["Draft", "Descartado", "Vendido", "Alquilado"]),
    // Sold/rented within the last 2 weeks
    and(
      sql`${listings.status} IN ('Vendido', 'Alquilado')`,
      sql`${listings.updatedAt} >= NOW() - INTERVAL '14 days'`,
    ),
  );
}

export async function getActiveLocations(accountId: bigint) {
  try {
    // Get distinct neighborhood IDs from properties through listings for this account
    const activeNeighborhoodIds = await db
      .selectDistinct({ neighborhoodId: properties.neighborhoodId })
      .from(listings)
      .innerJoin(properties, eq(listings.propertyId, properties.propertyId))
      .where(
        sql`${properties.neighborhoodId} IS NOT NULL AND ${listings.accountId} = ${accountId} AND ${listings.publishToWebsite} = true`,
      );

    if (activeNeighborhoodIds.length === 0) {
      return [];
    }

    // Get location details for active neighborhoods
    const locationData = await db
      .select({
        neighborhoodId: locations.neighborhoodId,
        city: locations.city,
        province: locations.province,
        municipality: locations.municipality,
        neighborhood: locations.neighborhood,
      })
      .from(locations)
      .where(
        sql`${locations.neighborhoodId} IN (${activeNeighborhoodIds
          .map((item) => item.neighborhoodId)
          .join(", ")}) AND ${locations.isActive} = true`,
      )
      .orderBy(locations.province, locations.city, locations.neighborhood);

    return locationData;
  } catch (error) {
    console.error("Error fetching active locations:", error);
    return [];
  }
}

export async function getAllLocations() {
  try {
    const locationData = await db
      .select({
        neighborhoodId: locations.neighborhoodId,
        city: locations.city,
        province: locations.province,
        municipality: locations.municipality,
        neighborhood: locations.neighborhood,
      })
      .from(locations)
      .where(sql`${locations.isActive} = true`)
      .orderBy(locations.province, locations.city, locations.neighborhood);

    return locationData;
  } catch (error) {
    console.error("Error fetching all locations:", error);
    return [];
  }
}

export async function getCities(accountId: bigint) {
  try {
    const cities = await db
      .selectDistinct({
        city: locations.city,
        province: locations.province,
      })
      .from(listings)
      .innerJoin(properties, eq(listings.propertyId, properties.propertyId))
      .innerJoin(locations, eq(properties.neighborhoodId, locations.neighborhoodId))
      .where(
        and(
          eq(listings.accountId, accountId),
          eq(listings.isActive, true),
          eq(listings.publishToWebsite, true),
          eq(locations.isActive, true),
          websiteVisibleStatus(),
        ),
      )
      .orderBy(locations.province, locations.city);

    return cities;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
}

export async function getNeighborhoodsByCity(city: string, accountId: bigint) {
  try {
    const neighborhoods = await db
      .selectDistinct({
        neighborhoodId: locations.neighborhoodId,
        city: locations.city,
        province: locations.province,
        municipality: locations.municipality,
        neighborhood: locations.neighborhood,
      })
      .from(listings)
      .innerJoin(properties, eq(listings.propertyId, properties.propertyId))
      .innerJoin(locations, eq(properties.neighborhoodId, locations.neighborhoodId))
      .where(
        and(
          eq(locations.city, city),
          eq(listings.accountId, accountId),
          eq(listings.isActive, true),
          eq(listings.publishToWebsite, true),
          eq(locations.isActive, true),
          websiteVisibleStatus(),
        ),
      )
      .orderBy(locations.neighborhood);

    return neighborhoods;
  } catch (error) {
    console.error("Error fetching neighborhoods:", error);
    return [];
  }
}

export async function getPropertyTypes(accountId: bigint) {
  try {
    const propertyTypes = await db
      .selectDistinct({ propertyType: properties.propertyType })
      .from(properties)
      .where(
        sql`${properties.accountId} = ${accountId} AND ${properties.isActive} = true`,
      )
      .orderBy(properties.propertyType);

    return propertyTypes.map((p) => p.propertyType).filter(Boolean);
  } catch (error) {
    console.error("Error fetching property types:", error);
    return [];
  }
}

export async function getPriceRange(accountId: bigint) {
  try {
    const priceRange = await db
      .select({
        minPrice: min(listings.price),
        maxPrice: max(listings.price),
      })
      .from(listings)
      .where(
        sql`${listings.accountId} = ${accountId} AND ${listings.isActive} = true AND ${listings.publishToWebsite} = true`,
      );

    return priceRange[0] || { minPrice: 0, maxPrice: 2000000 };
  } catch (error) {
    console.error("Error fetching price range:", error);
    return { minPrice: 0, maxPrice: 2000000 };
  }
}
