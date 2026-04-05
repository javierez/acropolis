"use server";

import { db } from "../db";
import {
  properties,
  listings,
  locations,
  users,
  propertyImages,
} from "~/server/db/schema";
import { eq, and, desc, asc, sql, or, notInArray, inArray } from "drizzle-orm";
import { cache } from "react";
import { env } from "~/env";

const ACCOUNT_ID = 21n;

export type FeedImage = {
  propertyImageId: string;
  imageUrl: string;
  imageOrder: number;
  imageTag: string | null;
};

export type ListingCardData = {
  // Essential listing fields
  listingId: bigint;
  propertyId: bigint;
  price: string;
  listingType: string;
  status: string;
  isBankOwned: boolean | null;
  isOportunidad: boolean | null;
  agentName: string | null;

  // Essential property fields
  title: string | null;
  description: string | null;
  propertyType: string | null;
  bedrooms: number | null;
  bathrooms: string | null;
  squareMeter: number | null;
  builtSurfaceArea: string | null;
  street: string | null;

  // Location fields
  city: string | null;
  province: string | null;

  // Image fields
  imageUrl: string | null;
  imageUrl2: string | null;
};

export interface SearchFilters {
  location?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  status?: "for-sale" | "for-rent";
  isOportunidad?: boolean;
}

export type SortOption = "default" | "newest" | "price-asc" | "price-desc" | "size-asc" | "size-desc";

function buildWhereConditions(filters?: SearchFilters) {
  // Exclude Draft/Descartado always; Vendido/Alquilado only if updated within last 2 weeks
  const whereConditions = [
    eq(listings.accountId, ACCOUNT_ID),
    eq(listings.isActive, true),
    eq(listings.publishToWebsite, true),
    or(
      notInArray(listings.status, ["Draft", "Descartado", "Vendido", "Alquilado"]),
      and(
        sql`${listings.status} IN ('Vendido', 'Alquilado')`,
        sql`${listings.updatedAt} >= NOW() - INTERVAL '14 days'`,
      ),
    ),
  ];

  if (filters) {
    if (filters.location && filters.location !== "todas-ubicaciones") {
      const locationValue = filters.location.replace(/-/g, " ");
      whereConditions.push(
        sql`(
        LOWER(${locations.city}) LIKE ${`%${locationValue.toLowerCase()}%`} OR
        LOWER(${locations.province}) LIKE ${`%${locationValue.toLowerCase()}%`} OR
        LOWER(${properties.street}) LIKE ${`%${locationValue.toLowerCase()}%`}
      )`,
      );
    }

    if (filters.propertyType && filters.propertyType !== "any") {
      whereConditions.push(
        eq(properties.propertyType, filters.propertyType),
      );
    }

    if (filters.status) {
      if (filters.status === "for-rent") {
        whereConditions.push(
          sql`${listings.listingType} IN ('Rent', 'RentWithOption')`,
        );
      } else {
        whereConditions.push(eq(listings.listingType, "Sale"));
      }
    }

    if (filters.bedrooms && filters.bedrooms > 0) {
      whereConditions.push(
        sql`${properties.bedrooms} >= ${filters.bedrooms}`,
      );
    }

    if (filters.bathrooms && filters.bathrooms > 0) {
      whereConditions.push(
        sql`CAST(${properties.bathrooms} AS DECIMAL) >= ${filters.bathrooms}`,
      );
    }

    if (filters.minPrice && filters.minPrice > 0) {
      whereConditions.push(
        sql`CAST(${listings.price} AS DECIMAL) >= ${filters.minPrice}`,
      );
    }

    if (filters.maxPrice && filters.maxPrice > 0) {
      whereConditions.push(
        sql`CAST(${listings.price} AS DECIMAL) <= ${filters.maxPrice}`,
      );
    }

    if (filters.minArea && filters.minArea > 0) {
      whereConditions.push(
        sql`${properties.squareMeter} >= ${filters.minArea}`,
      );
    }

    if (filters.maxArea && filters.maxArea > 0) {
      whereConditions.push(
        sql`${properties.squareMeter} <= ${filters.maxArea}`,
      );
    }

    if (filters.isOportunidad) {
      whereConditions.push(eq(listings.isOportunidad, true));
    }
  }

  return whereConditions;
}

export const countListings = cache(
  async (filters?: SearchFilters): Promise<number> => {
    try {
      const whereConditions = buildWhereConditions(filters);

      const result = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(listings)
        .innerJoin(properties, eq(listings.propertyId, properties.propertyId))
        .leftJoin(
          locations,
          eq(properties.neighborhoodId, locations.neighborhoodId),
        )
        .where(and(...whereConditions));

      return Number(result[0]?.count ?? 0);
    } catch (error) {
      console.error("Error counting listings:", error);
      return 0;
    }
  },
);

export const searchListings = cache(
  async (filters?: SearchFilters, limit = 24, sort: SortOption = "default", offset = 0): Promise<ListingCardData[]> => {
    try {
      const whereConditions = buildWhereConditions(filters);

      const listingsData = await db
        .select({
          // Essential listing fields
          listingId: listings.listingId,
          propertyId: listings.propertyId,
          price: listings.price,
          listingType: listings.listingType,
          status: listings.status,
          isBankOwned: listings.isBankOwned,
          isOportunidad: listings.isOportunidad,

          // Essential property fields
          title: properties.title,
          description: properties.description,
          propertyType: properties.propertyType,
          bedrooms: properties.bedrooms,
          bathrooms: properties.bathrooms,
          squareMeter: properties.squareMeter,
          builtSurfaceArea: properties.builtSurfaceArea,
          street: properties.street,

          // Location fields
          city: locations.city,
          province: locations.province,

          // Agent name
          agentName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,

          // First image subquery (minimum image_order)
          imageUrl: sql<string>`(
          SELECT image_url
          FROM property_images
          WHERE property_id = ${properties.propertyId}
            AND is_active = true
            AND (image_tag IS NULL OR image_tag NOT IN ('tour', 'youtube', 'video'))
          ORDER BY image_order ASC
          LIMIT 1
        )`,

          // Second image subquery (second minimum image_order)
          imageUrl2: sql<string>`(
          SELECT image_url
          FROM property_images
          WHERE property_id = ${properties.propertyId}
            AND is_active = true
            AND (image_tag IS NULL OR image_tag NOT IN ('tour', 'youtube', 'video'))
          ORDER BY image_order ASC
          LIMIT 1 OFFSET 1
        )`,
        })
        .from(listings)
        .innerJoin(properties, eq(listings.propertyId, properties.propertyId))
        .leftJoin(
          locations,
          eq(properties.neighborhoodId, locations.neighborhoodId),
        )
        .leftJoin(users, eq(listings.agentId, users.id))
        .where(and(...whereConditions))
        .orderBy(
          ...(() => {
            switch (sort) {
              case "newest":
                return [desc(listings.createdAt)];
              case "price-asc":
                return [asc(sql`CAST(${listings.price} AS DECIMAL)`)];
              case "price-desc":
                return [desc(sql`CAST(${listings.price} AS DECIMAL)`)];
              case "size-asc":
                return [asc(sql`COALESCE(${properties.squareMeter}, 0)`)];
              case "size-desc":
                return [desc(sql`COALESCE(${properties.squareMeter}, 0)`)];
              default:
                return [desc(listings.isFeatured), desc(listings.price)];
            }
          })(),
        )
        .limit(limit)
        .offset(offset);

      // Transform the data
      return listingsData.map((listing) => ({
        listingId: listing.listingId,
        propertyId: listing.propertyId,
        price: listing.price?.toString() || "0",
        listingType: listing.listingType,
        status: listing.status,
        isBankOwned: listing.isBankOwned,
        isOportunidad: listing.isOportunidad,
        agentName: listing.agentName,
        title: listing.title,
        description: listing.description,
        propertyType: listing.propertyType,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms?.toString() || null,
        squareMeter: listing.squareMeter,
        builtSurfaceArea: listing.builtSurfaceArea?.toString() || null,
        street: listing.street,
        city: listing.city,
        province: listing.province,
        imageUrl: listing.imageUrl,
        imageUrl2: listing.imageUrl2,
      }));
    } catch (error) {
      console.error("Error searching listings:", error);
      return [];
    }
  },
);

export const getListingsForGrid = cache(
  async (limit = 12): Promise<ListingCardData[]> => {
    try {
      // Simplified query with subqueries for images
      const listingsData = await db
        .select({
          // Essential listing fields
          listingId: listings.listingId,
          propertyId: listings.propertyId,
          price: listings.price,
          listingType: listings.listingType,
          status: listings.status,
          isBankOwned: listings.isBankOwned,
          isOportunidad: listings.isOportunidad,

          // Essential property fields
          title: properties.title,
          description: properties.description,
          propertyType: properties.propertyType,
          bedrooms: properties.bedrooms,
          bathrooms: properties.bathrooms,
          squareMeter: properties.squareMeter,
          builtSurfaceArea: properties.builtSurfaceArea,
          street: properties.street,

          // Location fields
          city: locations.city,
          province: locations.province,

          // Agent name
          agentName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,

          // First image subquery (minimum image_order)
          imageUrl: sql<string>`(
          SELECT image_url
          FROM property_images
          WHERE property_id = ${properties.propertyId}
            AND is_active = true
            AND (image_tag IS NULL OR image_tag NOT IN ('tour', 'youtube', 'video'))
          ORDER BY image_order ASC
          LIMIT 1
        )`,

          // Second image subquery (second minimum image_order)
          imageUrl2: sql<string>`(
          SELECT image_url
          FROM property_images
          WHERE property_id = ${properties.propertyId}
            AND is_active = true
            AND (image_tag IS NULL OR image_tag NOT IN ('tour', 'youtube', 'video'))
          ORDER BY image_order ASC
          LIMIT 1 OFFSET 1
        )`,
        })
        .from(listings)
        .innerJoin(properties, eq(listings.propertyId, properties.propertyId))
        .leftJoin(
          locations,
          eq(properties.neighborhoodId, locations.neighborhoodId),
        )
        .leftJoin(users, eq(listings.agentId, users.id))
        .where(
          and(
            eq(listings.accountId, ACCOUNT_ID),
            eq(listings.isActive, true),
            eq(listings.publishToWebsite, true),
            or(
              notInArray(listings.status, ["Draft", "Descartado", "Vendido", "Alquilado"]),
              and(
                sql`${listings.status} IN ('Vendido', 'Alquilado')`,
                sql`${listings.updatedAt} >= NOW() - INTERVAL '14 days'`,
              ),
            ),
          ),
        )
        .orderBy(desc(listings.isFeatured), desc(listings.price))
        .limit(limit);

      // Transform the data
      return listingsData.map((listing) => ({
        listingId: listing.listingId,
        propertyId: listing.propertyId,
        price: listing.price?.toString() || "0",
        listingType: listing.listingType,
        status: listing.status,
        isBankOwned: listing.isBankOwned,
        isOportunidad: listing.isOportunidad,
        agentName: listing.agentName,
        title: listing.title,
        description: listing.description,
        propertyType: listing.propertyType,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms?.toString() || null,
        squareMeter: listing.squareMeter,
        builtSurfaceArea: listing.builtSurfaceArea?.toString() || null,
        street: listing.street,
        city: listing.city,
        province: listing.province,
        imageUrl: listing.imageUrl,
        imageUrl2: listing.imageUrl2,
      }));
    } catch (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
  },
);

// Get detailed listing information including all related data
export const getListingDetails = cache(
  async (listingId: number): Promise<any> => {
    try {
      const ACCOUNT_ID = 21n;

      const [listingDetails] = await db
        .select({
          // Listing fields
          listingId: listings.listingId,
          propertyId: listings.propertyId,
          agentId: listings.agentId,
          listingType: listings.listingType,
          price: listings.price,
          status: listings.status,
          isFurnished: listings.isFurnished,
          furnitureQuality: listings.furnitureQuality,
          optionalGarage: listings.optionalGarage,
          optionalGaragePrice: listings.optionalGaragePrice,
          optionalStorageRoom: listings.optionalStorageRoom,
          optionalStorageRoomPrice: listings.optionalStorageRoomPrice,
          hasKeys: listings.hasKeys,
          studentFriendly: listings.studentFriendly,
          petsAllowed: listings.petsAllowed,
          appliancesIncluded: listings.appliancesIncluded,
          internet: listings.internet,
          oven: listings.oven,
          microwave: listings.microwave,
          washingMachine: listings.washingMachine,
          fridge: listings.fridge,
          tv: listings.tv,
          stoneware: listings.stoneware,
          fotocasa: listings.fotocasa,
          fcLocationVisibility: listings.fcLocationVisibility,
          idealista: listings.idealista,
          habitaclia: listings.habitaclia,
          pisoscom: listings.pisoscom,
          yaencontre: listings.yaencontre,
          milanuncios: listings.milanuncios,
          isFeatured: listings.isFeatured,
          isBankOwned: listings.isBankOwned,
          visibilityMode: listings.visibilityMode,
          isActive: listings.isActive,
          viewCount: listings.viewCount,
          inquiryCount: listings.inquiryCount,
          createdAt: listings.createdAt,
          updatedAt: listings.updatedAt,

          // Property fields
          title: properties.title,
          description: properties.description,
          propertyType: properties.propertyType,
          propertySubtype: properties.propertySubtype,
          formPosition: properties.formPosition,
          bedrooms: properties.bedrooms,
          bathrooms: properties.bathrooms,
          squareMeter: properties.squareMeter,
          yearBuilt: properties.yearBuilt,
          cadastralReference: properties.cadastralReference,
          builtSurfaceArea: properties.builtSurfaceArea,
          street: properties.street,
          addressDetails: properties.addressDetails,
          postalCode: properties.postalCode,
          neighborhoodId: properties.neighborhoodId,
          latitude: properties.latitude,
          longitude: properties.longitude,
          energyCertification: properties.energyCertification,
          energyCertificateStatus: properties.energyCertificateStatus,
          energyConsumptionScale: properties.energyConsumptionScale,
          energyConsumptionValue: properties.energyConsumptionValue,
          emissionsScale: properties.emissionsScale,
          emissionsValue: properties.emissionsValue,
          hasHeating: properties.hasHeating,
          heatingType: properties.heatingType,
          hasElevator: properties.hasElevator,
          hasGarage: properties.hasGarage,
          hasStorageRoom: properties.hasStorageRoom,
          garageType: properties.garageType,
          garageSpaces: properties.garageSpaces,
          garageInBuilding: properties.garageInBuilding,
          elevatorToGarage: properties.elevatorToGarage,
          garageNumber: properties.garageNumber,
          disabledAccessible: properties.disabledAccessible,
          vpo: properties.vpo,
          videoIntercom: properties.videoIntercom,
          conciergeService: properties.conciergeService,
          securityGuard: properties.securityGuard,
          satelliteDish: properties.satelliteDish,
          doubleGlazing: properties.doubleGlazing,
          alarm: properties.alarm,
          securityDoor: properties.securityDoor,
          brandNew: properties.brandNew,
          newConstruction: properties.newConstruction,
          underConstruction: properties.underConstruction,
          needsRenovation: properties.needsRenovation,
          lastRenovationYear: properties.lastRenovationYear,
          kitchenType: properties.kitchenType,
          hotWaterType: properties.hotWaterType,
          openKitchen: properties.openKitchen,
          frenchKitchen: properties.frenchKitchen,
          furnishedKitchen: properties.furnishedKitchen,
          pantry: properties.pantry,
          storageRoomSize: properties.storageRoomSize,
          storageRoomNumber: properties.storageRoomNumber,
          terrace: properties.terrace,
          terraceSize: properties.terraceSize,
          wineCellar: properties.wineCellar,
          wineCellarSize: properties.wineCellarSize,
          livingRoomSize: properties.livingRoomSize,
          balconyCount: properties.balconyCount,
          galleryCount: properties.galleryCount,
          buildingFloors: properties.buildingFloors,
          builtInWardrobes: properties.builtInWardrobes,
          mainFloorType: properties.mainFloorType,
          shutterType: properties.shutterType,
          carpentryType: properties.carpentryType,
          orientation: properties.orientation,
          airConditioningType: properties.airConditioningType,
          windowType: properties.windowType,
          exterior: properties.exterior,
          bright: properties.bright,
          views: properties.views,
          mountainViews: properties.mountainViews,
          seaViews: properties.seaViews,
          beachfront: properties.beachfront,
          jacuzzi: properties.jacuzzi,
          hydromassage: properties.hydromassage,
          garden: properties.garden,
          pool: properties.pool,
          homeAutomation: properties.homeAutomation,
          musicSystem: properties.musicSystem,
          laundryRoom: properties.laundryRoom,
          coveredClothesline: properties.coveredClothesline,
          fireplace: properties.fireplace,
          gym: properties.gym,
          sportsArea: properties.sportsArea,
          childrenArea: properties.childrenArea,
          suiteBathroom: properties.suiteBathroom,
          nearbyPublicTransport: properties.nearbyPublicTransport,
          communityPool: properties.communityPool,
          privatePool: properties.privatePool,
          tennisCourt: properties.tennisCourt,
          conservationStatus: properties.conservationStatus,

          // Location fields
          city: locations.city,
          province: locations.province,
          municipality: locations.municipality,
          neighborhood: locations.neighborhood,

          // Agent information
          agentName: sql<string>`CONCAT(${users.firstName}, ' ', ${users.lastName})`,
          agentEmail: users.email,
          agentPhone: users.phone,
          agentImage: users.image,

          // Owner information (just full name)
          owner: sql<string>`(
          SELECT CONCAT(c.first_name, ' ', c.last_name)
          FROM listing_contacts lc
          JOIN contacts c ON lc.contact_id = c.contact_id
          WHERE lc.listing_id = ${listings.listingId}
          AND lc.contact_type = 'owner'
          AND lc.is_active = true
          AND c.is_active = true
          LIMIT 1
        )`,

          // First image only (we'll fetch all images separately if needed)
          firstImageUrl: sql<string>`(
          SELECT image_url 
          FROM property_images 
          WHERE property_id = ${properties.propertyId} 
            AND is_active = true 
            AND (image_tag IS NULL OR image_tag NOT IN ('tour', 'youtube', 'video'))
          ORDER BY image_order ASC
          LIMIT 1
        )`,
        })
        .from(listings)
        .innerJoin(properties, eq(listings.propertyId, properties.propertyId))
        .leftJoin(
          locations,
          eq(properties.neighborhoodId, locations.neighborhoodId),
        )
        .leftJoin(users, eq(listings.agentId, users.id))
        .where(
          and(
            eq(listings.listingId, BigInt(listingId)),
            eq(listings.accountId, ACCOUNT_ID),
            eq(listings.isActive, true),
            eq(listings.publishToWebsite, true),
          ),
        );

      if (!listingDetails) {
        throw new Error("Listing not found");
      }


      // Convert BigInt values to strings to avoid serialization issues
      const serializedDetails = {
        ...listingDetails,
        listingId: listingDetails.listingId.toString(),
        propertyId: listingDetails.propertyId.toString(),
        neighborhoodId: listingDetails.neighborhoodId
          ? listingDetails.neighborhoodId.toString()
          : null,
      };

      return serializedDetails;
    } catch (error) {
      console.error("Error fetching listing details:", error);
      throw error;
    }
  },
);

// Lightweight query for sitemap generation — active published listings only
export const getAllListingSitemapData = cache(
  async (): Promise<{ listingId: string; updatedAt: Date | null }[]> => {
    try {
      const rows = await db
        .select({
          listingId: listings.listingId,
          updatedAt: listings.updatedAt,
        })
        .from(listings)
        .where(
          and(
            eq(listings.accountId, ACCOUNT_ID),
            eq(listings.isActive, true),
            eq(listings.publishToWebsite, true),
          ),
        );

      return rows.map((row) => ({
        listingId: row.listingId.toString(),
        updatedAt: row.updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching listing sitemap data:", error);
      return [];
    }
  },
);

// Returns distinct (propertyType, city, listingType) tuples for search landing pages
export const getDistinctSearchCombinations = cache(
  async (): Promise<
    { propertyType: string; city: string; status: "for-sale" | "for-rent" }[]
  > => {
    try {
      const rows = await db
        .selectDistinct({
          propertyType: properties.propertyType,
          city: locations.city,
          listingType: listings.listingType,
        })
        .from(listings)
        .innerJoin(properties, eq(listings.propertyId, properties.propertyId))
        .leftJoin(
          locations,
          eq(properties.neighborhoodId, locations.neighborhoodId),
        )
        .where(
          and(
            eq(listings.accountId, ACCOUNT_ID),
            eq(listings.isActive, true),
            eq(listings.publishToWebsite, true),
          ),
        );

      const results: {
        propertyType: string;
        city: string;
        status: "for-sale" | "for-rent";
      }[] = [];

      for (const row of rows) {
        if (!row.propertyType || !row.city) continue;

        let status: "for-sale" | "for-rent";
        if (row.listingType === "Sale") {
          status = "for-sale";
        } else if (
          row.listingType === "Rent" ||
          row.listingType === "RentWithOption"
        ) {
          status = "for-rent";
        } else {
          continue; // skip Transfer, Sold, etc.
        }

        results.push({
          propertyType: row.propertyType,
          city: row.city,
          status,
        });
      }

      return results;
    } catch (error) {
      console.error("Error fetching distinct search combinations:", error);
      return [];
    }
  },
);

// Get all images for a property
export const getPropertyImages = cache(
  async (propertyId: string): Promise<any[]> => {
    try {

      const images = await db
        .select({
          propertyImageId: propertyImages.propertyImageId,
          imageUrl: propertyImages.imageUrl,
          s3key: propertyImages.s3key,
          imageOrder: propertyImages.imageOrder,
          imageTag: propertyImages.imageTag,
          originImageId: propertyImages.originImageId,
        })
        .from(propertyImages)
        .where(
          and(
            eq(propertyImages.propertyId, BigInt(propertyId)),
            eq(propertyImages.isActive, true),
            sql`(${propertyImages.imageTag} IS NULL OR ${propertyImages.imageTag} NOT IN ('tour', 'youtube', 'video'))`,
          ),
        )
        .orderBy(propertyImages.imageOrder);


      // Convert BigInt to string
      return images.map((img) => ({
        ...img,
        propertyImageId: img.propertyImageId.toString(),
        originImageId: img.originImageId?.toString() ?? null,
      }));
    } catch (error) {
      console.error("Error fetching property images:", error);
      return [];
    }
  },
);

// Get all images for multiple properties at once (for feed view)
export const getImagesForListings = cache(
  async (propertyIds: bigint[]): Promise<Map<string, FeedImage[]>> => {
    if (propertyIds.length === 0) return new Map();

    try {
      const images = await db
        .select({
          propertyId: propertyImages.propertyId,
          propertyImageId: propertyImages.propertyImageId,
          imageUrl: propertyImages.imageUrl,
          imageOrder: propertyImages.imageOrder,
          imageTag: propertyImages.imageTag,
        })
        .from(propertyImages)
        .where(
          and(
            inArray(propertyImages.propertyId, propertyIds),
            eq(propertyImages.isActive, true),
            sql`(${propertyImages.imageTag} IS NULL OR ${propertyImages.imageTag} NOT IN ('tour', 'youtube', 'video'))`,
          ),
        )
        .orderBy(propertyImages.propertyId, propertyImages.imageOrder);

      const grouped = new Map<string, FeedImage[]>();
      for (const img of images) {
        const key = img.propertyId.toString();
        const entry: FeedImage = {
          propertyImageId: img.propertyImageId.toString(),
          imageUrl: img.imageUrl,
          imageOrder: img.imageOrder,
          imageTag: img.imageTag,
        };
        const existing = grouped.get(key);
        if (existing) {
          existing.push(entry);
        } else {
          grouped.set(key, [entry]);
        }
      }
      return grouped;
    } catch (error) {
      console.error("Error fetching images for listings:", error);
      return new Map();
    }
  },
);
