import { NextResponse, type NextRequest } from "next/server";
import { isAllowedImageUrl, applyWatermark } from "~/lib/watermark";
import { db } from "~/server/db";
import { websiteProperties } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "~/env";
import type { WatermarkConfig } from "~/server/queries/watermark";

export const dynamic = "force-dynamic";

/** Fetch watermark config directly (no React cache) for use in Route Handlers */
async function fetchWatermarkConfig(): Promise<WatermarkConfig> {
  try {
    const accountId = BigInt(env.NEXT_PUBLIC_ACCOUNT_ID);
    const [config] = await db
      .select({
        watermarkProps: websiteProperties.watermarkProps,
        logo: websiteProperties.logo,
      })
      .from(websiteProperties)
      .where(eq(websiteProperties.accountId, accountId))
      .limit(1);

    if (!config) {
      return { enabled: false, position: "southeast", sizePercentage: 30, opacity: 0.8, logoUrl: "" };
    }

    let watermarkProps: Record<string, unknown> = {};
    try {
      watermarkProps = JSON.parse(config.watermarkProps || "{}") as Record<string, unknown>;
    } catch { /* empty */ }

    return {
      enabled: (watermarkProps.enabled as boolean) || false,
      position: (watermarkProps.position as string) || "southeast",
      sizePercentage: (watermarkProps.sizePercentage as number) || 30,
      opacity: (watermarkProps.opacity as number) || 0.8,
      logoUrl: config.logo || "",
    };
  } catch (error) {
    console.error("[api/image] DB error fetching watermark config:", error);
    return { enabled: false, position: "southeast", sizePercentage: 30, opacity: 0.8, logoUrl: "" };
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");
    const debug = request.nextUrl.searchParams.get("debug");

    console.log("[api/image] Request received, url:", url);

    // Debug mode: return JSON diagnostic info
    if (debug === "1") {
      const config = await fetchWatermarkConfig();
      const allowed = url ? isAllowedImageUrl(url) : false;
      let hostname = "";
      try { if (url) hostname = new URL(url).hostname; } catch { hostname = "INVALID"; }
      return NextResponse.json({ url, hostname, allowed, watermarkConfig: config });
    }

    if (!url) {
      return new NextResponse("Missing url parameter", { status: 400 });
    }

    const allowed = isAllowedImageUrl(url);
    console.log("[api/image] allowed:", allowed, "hostname:", (() => { try { return new URL(url).hostname; } catch { return "INVALID"; } })());

    if (!allowed) {
      return new NextResponse(`URL not allowed: ${url}`, { status: 403 });
    }

    const cacheHeaders = {
      "Cache-Control": "public, s-maxage=604800, max-age=86400, stale-while-revalidate=86400",
    };

    let imageBuffer: Buffer;
    let contentType: string;

    try {
      const imageResponse = await fetch(url);
      if (!imageResponse.ok) {
        console.log("[api/image] Fetch failed:", imageResponse.status);
        return new NextResponse("Failed to fetch image", { status: 502 });
      }
      imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
      console.log("[api/image] Fetched OK, size:", imageBuffer.length);
    } catch (fetchErr) {
      console.error("[api/image] Fetch error:", fetchErr);
      return new NextResponse("Failed to fetch image", { status: 502 });
    }

    const config = await fetchWatermarkConfig();
    console.log("[api/image] Config:", JSON.stringify(config));

    if (!config.enabled || !config.logoUrl) {
      console.log("[api/image] Watermark disabled, returning original");
      return new NextResponse(imageBuffer, {
        headers: { "Content-Type": contentType, ...cacheHeaders },
      });
    }

    try {
      console.log("[api/image] Applying watermark...");
      const watermarkedBuffer = await applyWatermark(imageBuffer, config);
      console.log("[api/image] Done, output size:", watermarkedBuffer.length);
      return new NextResponse(watermarkedBuffer, {
        headers: { "Content-Type": "image/jpeg", ...cacheHeaders },
      });
    } catch (error) {
      console.error("[api/image] Watermark error:", error);
      return new NextResponse(imageBuffer, {
        headers: { "Content-Type": contentType, ...cacheHeaders },
      });
    }
  } catch (topError) {
    console.error("[api/image] TOP-LEVEL ERROR:", topError);
    return new NextResponse(
      JSON.stringify({ error: String(topError) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
