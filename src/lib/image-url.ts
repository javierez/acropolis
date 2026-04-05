/** Returns a URL that serves the image with watermark baked in (if enabled) */
export function getWatermarkedImageUrl(
  originalUrl: string | null | undefined,
  watermarkEnabled: boolean,
): string {
  if (!originalUrl) return "";
  if (!watermarkEnabled) return originalUrl;
  // Local paths don't need watermarking via the API
  if (originalUrl.startsWith("/")) return originalUrl;

  return `/api/image?url=${encodeURIComponent(originalUrl)}`;
}
