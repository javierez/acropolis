"use server";

import { db } from "~/server/db";
import {
  contacts,
  properties,
  listings,
  listingContacts,
  propertyImages,
} from "~/server/db/schema";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import { env } from "~/env";
import type { PropertyFormData } from "~/types/property-form";
import { eq, desc } from "drizzle-orm";
import { getAdminAgent } from "~/server/queries/agents";
import { generatePropertyTitle } from "~/lib/property-title";
import { retrieveGeocodingData } from "~/server/googlemaps/retrieve_geo";

// Initialize S3 Client (only if AWS credentials are available)
const s3Client =
  process.env.AWS_REGION &&
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET
    ? new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })
    : null;

// Upload Image to S3 (following the pattern from your example)
async function uploadImageToS3(
  file: File,
  referenceNumber: string,
  imageOrder: number,
): Promise<{ imageUrl: string; s3key: string; imageKey: string }> {
  if (!s3Client || !process.env.AWS_S3_BUCKET) {
    throw new Error("S3 configuration not available");
  }

  const fileExtension = file.name?.split(".").pop() || "jpg";
  const imageKey = `${referenceNumber}/images/image_${imageOrder}_${nanoid(6)}.${fileExtension}`;

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to S3
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: imageKey,
      Body: buffer,
      ContentType: file.type || "image/jpeg",
    }),
  );

  // Return full URL and keys
  const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`;
  const s3key = `s3://${process.env.AWS_S3_BUCKET}/${imageKey}`;

  return {
    imageUrl,
    s3key,
    imageKey,
  };
}

export async function submitPropertyListing(formData: PropertyFormData) {
  try {
    // Generate reference number
    const referenceNumber = `VESTA${nanoid(8).toUpperCase()}`;
    const accountId = BigInt(env.NEXT_PUBLIC_ACCOUNT_ID);

    // 1. Insert contact information (following the pattern with BigInt)
    await db.insert(contacts).values({
      accountId,
      firstName: formData.contactInfo.nombre,
      lastName: formData.contactInfo.apellidos,
      email: formData.contactInfo.email || null,
      phone: formData.contactInfo.telefono || null,
      isActive: true,
      additionalInfo: JSON.stringify({
        notes: "Contacto generado vía web"
      }),
    });

    // Get the inserted contact ID
    const [insertedContact] = await db
      .select({ contactId: contacts.contactId })
      .from(contacts)
      .where(eq(contacts.accountId, accountId))
      .orderBy(desc(contacts.createdAt))
      .limit(1);

    if (!insertedContact) {
      throw new Error("Failed to insert contact");
    }

    const contactId = insertedContact.contactId;

    // 2. Geocode the address and get location data
    const fullAddress = `${formData.locationInfo.direccion} ${formData.locationInfo.numero || ""}, ${formData.locationInfo.localidad}, ${formData.locationInfo.provincia || ""}, Spain`.trim();
    
    console.log(`Attempting to geocode address: ${fullAddress}`);
    const geocodingResult = await retrieveGeocodingData(fullAddress);
    
    // Generate proper property title using street and neighborhood
    const propertyTitle = generatePropertyTitle(
      formData.propertyInfo.tipo,
      formData.locationInfo.direccion,
      geocodingResult?.neighborhood
    );

    console.log(`Generated property title: ${propertyTitle}`);

    // 3. Insert property information
    await db.insert(properties).values({
      accountId,
      referenceNumber,
      title: propertyTitle,
      propertyType: formData.propertyInfo.tipo,
      bedrooms: formData.propertyInfo.habitaciones
        ? parseInt(formData.propertyInfo.habitaciones)
        : null,
      bathrooms: formData.propertyInfo.banos
        ? formData.propertyInfo.banos
        : null, // Keep as string
      squareMeter: formData.propertyInfo.superficie
        ? parseInt(formData.propertyInfo.superficie)
        : null,
      street: formData.locationInfo.direccion,
      addressDetails:
        `${formData.locationInfo.numero || ""} ${formData.locationInfo.planta || ""} ${formData.locationInfo.puerta || ""}`.trim() ||
        null,
      postalCode: formData.locationInfo.codigoPostal,
      // Add geocoding data
      neighborhoodId: geocodingResult?.neighborhoodId ? BigInt(geocodingResult.neighborhoodId) : null,
      latitude: geocodingResult?.latitude ? geocodingResult.latitude : null,
      longitude: geocodingResult?.longitude ? geocodingResult.longitude : null,
      // Map caracteristicas to boolean fields
      hasElevator: formData.propertyInfo.caracteristicas.includes("Ascensor"),
      hasGarage: formData.propertyInfo.caracteristicas.includes("Garaje"),
      hasStorageRoom:
        formData.propertyInfo.caracteristicas.includes("Trastero"),
      pool: formData.propertyInfo.caracteristicas.includes("Piscina"),
      garden: formData.propertyInfo.caracteristicas.includes("Jardín"),
      balconyCount: formData.propertyInfo.caracteristicas.includes("Balcón")
        ? 1
        : 0,
      terrace: formData.propertyInfo.caracteristicas.includes("Terraza"),
      airConditioningType: formData.propertyInfo.caracteristicas.includes(
        "Aire acondicionado",
      )
        ? "central"
        : null,
      hasHeating: formData.propertyInfo.caracteristicas.includes("Calefacción"),
      securityGuard:
        formData.propertyInfo.caracteristicas.includes("Seguridad 24h"),
      builtInWardrobes:
        formData.propertyInfo.caracteristicas.includes("Armarios empotrados") ||
        false,
      seaViews: formData.propertyInfo.caracteristicas.includes("Vistas al mar"),
      mountainViews: formData.propertyInfo.caracteristicas.includes(
        "Vistas a la montaña",
      ),
    });

    // Get the inserted property
    const [insertedProperty] = await db
      .select()
      .from(properties)
      .where(eq(properties.referenceNumber, referenceNumber))
      .limit(1);

    if (!insertedProperty) {
      throw new Error("Failed to insert property");
    }

    const propertyId = insertedProperty.propertyId;

    // 4. Determine listing type and price
    let listingType: "Sale" | "Rent" = "Sale";
    let price = "0";

    if (formData.economicInfo.precioVenta) {
      listingType = "Sale";
      price = formData.economicInfo.precioVenta;
    } else if (formData.economicInfo.precioAlquiler) {
      listingType = "Rent";
      price = formData.economicInfo.precioAlquiler;
    }

    // 5. Get admin agent and insert listing information
    const agentId = await getAdminAgent();
    
    await db.insert(listings).values({
      accountId,
      propertyId,
      agentId,
      listingType,
      price, // Already a string
      status: "Draft", // As requested
      isFurnished:
        formData.propertyInfo.caracteristicas.includes("Amueblado") || null,
      // Map additional economic info
      optionalGarage: false,
      optionalStorageRoom: false,
      hasKeys: false,
      studentFriendly: null,
      petsAllowed: null,
      appliancesIncluded: null,
    });

    // Get the inserted listing ID
    const [insertedListing] = await db
      .select({ listingId: listings.listingId })
      .from(listings)
      .where(eq(listings.propertyId, propertyId))
      .orderBy(desc(listings.createdAt))
      .limit(1);

    if (!insertedListing) {
      throw new Error("Failed to insert listing");
    }

    const listingId = insertedListing.listingId;

    // 6. Insert listing contact (owner)
    await db.insert(listingContacts).values({
      listingId,
      contactId,
      contactType: "owner",
    });

    // 7. Upload images to S3 and save to database (following the pattern)
    if (formData.images && formData.images.length > 0 && s3Client) {
      const imageUploadPromises = formData.images.map(
        async (imageFile, index) => {
          try {
            // Upload to S3
            const { imageUrl, s3key, imageKey } = await uploadImageToS3(
              imageFile,
              referenceNumber,
              index + 1,
            );

            // Save to database
            await db.insert(propertyImages).values({
              propertyId,
              referenceNumber,
              imageUrl,
              imageKey,
              s3key,
              imageOrder: index + 1,
              imageTag: index === 0 ? "main" : "additional",
            });

            return { success: true, imageUrl };
          } catch (error) {
            console.error(`Failed to upload image ${index + 1}:`, error);
            return { success: false, error };
          }
        },
      );

      await Promise.all(imageUploadPromises);
    } else if (formData.images && formData.images.length > 0 && !s3Client) {
      console.warn(
        "Images provided but S3 configuration not available. Property saved without images.",
      );
    }

    return {
      success: true,
      referenceNumber,
      propertyId: propertyId.toString(),
      listingId: listingId.toString(),
    };
  } catch (error) {
    console.error("Error submitting property listing:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
