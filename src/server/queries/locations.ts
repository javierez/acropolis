"use server";

import { db } from "~/server/db";
import { locations } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export interface LocationData {
  city: string;
  province: string;
  municipality: string;
  neighborhood: string;
}

/**
 * Find existing location or create new one and return neighborhood ID
 * 
 * @param locationData - Location data from geocoding
 * @returns neighborhood_id as number
 */
export async function findOrCreateLocation(locationData: LocationData): Promise<number> {
  try {
    // Search for existing location using all four fields
    const existingLocation = await db
      .select()
      .from(locations)
      .where(
        and(
          eq(locations.city, locationData.city),
          eq(locations.province, locationData.province),
          eq(locations.municipality, locationData.municipality),
          eq(locations.neighborhood, locationData.neighborhood),
        ),
      )
      .limit(1);

    // Return existing if found
    if (existingLocation.length > 0 && existingLocation[0]) {
      return Number(existingLocation[0].neighborhoodId);
    }

    // Create new if not found
    await db.insert(locations).values({
      city: locationData.city,
      province: locationData.province,
      municipality: locationData.municipality,
      neighborhood: locationData.neighborhood,
      isActive: true,
    });

    // Query back to get the auto-generated neighborhoodId
    const newLocation = await db
      .select()
      .from(locations)
      .where(
        and(
          eq(locations.city, locationData.city),
          eq(locations.province, locationData.province),
          eq(locations.municipality, locationData.municipality),
          eq(locations.neighborhood, locationData.neighborhood),
        ),
      )
      .limit(1);

    if (newLocation.length === 0 || !newLocation[0]) {
      throw new Error("Failed to create new location");
    }

    return Number(newLocation[0].neighborhoodId);
  } catch (error) {
    console.error("Error in findOrCreateLocation:", error);
    throw error;
  }
}

/**
 * Get location by neighborhood ID
 */
export async function getLocationByNeighborhoodId(neighborhoodId: bigint) {
  try {
    const result = await db
      .select()
      .from(locations)
      .where(eq(locations.neighborhoodId, neighborhoodId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error getting location by ID:", error);
    return null;
  }
}

/**
 * Get location by neighborhood name
 */
export async function getLocationByNeighborhood(neighborhood: string) {
  try {
    const result = await db
      .select()
      .from(locations)
      .where(eq(locations.neighborhood, neighborhood))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error getting location by neighborhood:", error);
    return null;
  }
}

/**
 * Check if location exists
 */
export async function locationExists(locationData: LocationData): Promise<boolean> {
  try {
    const result = await db
      .select()
      .from(locations)
      .where(
        and(
          eq(locations.city, locationData.city),
          eq(locations.province, locationData.province),
          eq(locations.municipality, locationData.municipality),
          eq(locations.neighborhood, locationData.neighborhood),
        ),
      )
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("Error checking location exists:", error);
    return false;
  }
}