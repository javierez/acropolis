"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Move } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import type { PropertyImage } from "~/lib/data";

interface WatermarkConfig {
  enabled: boolean;
  position: string;
  sizePercentage: number;
  opacity: number;
  logoUrl: string;
}

interface ImageGalleryProps {
  images: PropertyImage[];
  title: string;
  watermarkConfig?: WatermarkConfig;
}

/** Map position config to CSS classes for the watermark overlay */
function getWatermarkPositionClasses(position: string): string {
  switch (position) {
    case "northeast":
      return "top-4 right-4";
    case "northwest":
      return "top-4 left-4";
    case "southwest":
      return "bottom-4 left-4";
    case "center":
      return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    case "southeast":
    default:
      return "bottom-4 right-4";
  }
}

export function ImageGallery({ images, title, watermarkConfig }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(
    Array(images.length).fill(false),
  );

  // AI comparison modal state
  const [comparisonModal, setComparisonModal] = useState<{
    isOpen: boolean;
    aiImage: PropertyImage | null;
    originalImage: PropertyImage | null;
  } | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const comparisonContainerRef = useRef<HTMLDivElement | null>(null);

  // Use original images directly (watermark is now a CSS overlay)
  const validImages = images?.filter((img) => img.url && img.url !== "") || [];
  const defaultPlaceholder = "/suburban-dream.png";

  if (validImages.length === 0) {
    validImages.push({
      url: defaultPlaceholder,
      alt: title || "Property image",
    });
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageLoad = (index: number) => {
    setLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  // Transform image tags based on AI processing type
  const getDisplayLabel = (tag: string | undefined): string | undefined => {
    if (!tag) return undefined;
    if (tag.startsWith('ai_')) return undefined;
    return tag;
  };

  // Find original image by ID for AI comparison
  const findOriginalImage = (originId: string): PropertyImage | undefined => {
    return images.find(img => img.id === originId);
  };

  // AI tags that should NOT show the "Generado por IA" badge or compare button
  const excludedAiTags = ['ai_blur_faces', 'ai_remove_clutter', 'ai_enhance_lighting'];

  const shouldShowAiComparison = (image: PropertyImage): boolean => {
    if (!image.originImageId) return false;
    if (image.tag && excludedAiTags.includes(image.tag)) return false;
    return true;
  };

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!comparisonContainerRef.current) return;
    const rect = comparisonContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const openComparisonModal = (aiImage: PropertyImage) => {
    if (!aiImage.originImageId) return;
    const original = findOriginalImage(aiImage.originImageId);
    if (original) {
      setComparisonModal({ isOpen: true, aiImage, originalImage: original });
      setSliderPosition(50);
    }
  };

  // Watermark overlay config
  const showWatermark = watermarkConfig?.enabled && watermarkConfig.logoUrl;
  const watermarkPositionClasses = showWatermark
    ? getWatermarkPositionClasses(watermarkConfig.position)
    : "";

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
        {validImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              index === currentIndex
                ? "opacity-100"
                : "pointer-events-none opacity-0",
            )}
          >
            <Image
              src={image.url || "/placeholder.svg"}
              alt={image.alt || title}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                !loaded[index] && "opacity-0"
              )}
              priority={index === 0}
              onLoad={() => handleImageLoad(index)}
            />
            {!loaded[index] && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}

            {/* CSS watermark overlay */}
            {showWatermark && loaded[index] && (
              <div
                className={cn("pointer-events-none absolute z-10", watermarkPositionClasses)}
                style={{
                  width: `${watermarkConfig.sizePercentage}%`,
                  opacity: watermarkConfig.opacity,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={watermarkConfig.logoUrl}
                  alt=""
                  className="h-auto w-full"
                  onError={(e) => {
                    // Try fallback logo
                    const target = e.currentTarget;
                    if (target.src !== window.location.origin + "/logo.png") {
                      target.src = "/logo.png";
                    }
                  }}
                />
              </div>
            )}

            {/* AI-generated badge */}
            {shouldShowAiComparison(image) && (
              <Badge className="absolute bottom-4 left-4 bg-rose-500 text-white">
                Generado por IA
              </Badge>
            )}
            {/* Regular tag badge */}
            {!shouldShowAiComparison(image) && (() => {
              const displayLabel = getDisplayLabel(image.tag);
              return displayLabel && (
                <Badge className="absolute bottom-4 left-4 bg-black/70 text-white">
                  {displayLabel}
                </Badge>
              );
            })()}
            {/* Compare button for AI images */}
            {shouldShowAiComparison(image) && findOriginalImage(image.originImageId!) && (
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white"
                onClick={() => openComparisonModal(image)}
              >
                <Move className="mr-2 h-4 w-4" />
                Comparar
              </Button>
            )}
          </div>
        ))}

        {validImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {validImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2",
                index === currentIndex
                  ? "border-primary"
                  : "border-transparent",
              )}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt || `${title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* AI Comparison Modal */}
      {comparisonModal?.isOpen && comparisonModal.aiImage && comparisonModal.originalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/20"
              onClick={() => setComparisonModal(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            <div
              ref={comparisonContainerRef}
              className="relative aspect-[16/9] w-[90vw] max-w-6xl cursor-ew-resize overflow-hidden rounded-lg"
              onMouseMove={(e) => isDragging && updateSliderPosition(e.clientX)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchMove={(e) => isDragging && e.touches[0] && updateSliderPosition(e.touches[0].clientX)}
              onTouchEnd={() => setIsDragging(false)}
            >
              <Image
                src={comparisonModal.aiImage.url}
                alt="AI Enhanced"
                fill
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <Image
                  src={comparisonModal.originalImage.url}
                  alt="Original"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className="absolute bottom-0 top-0 w-1 bg-white shadow-lg transition-all duration-75 ease-out"
                style={{ left: `${sliderPosition}%` }}
              >
                <div
                  className={cn(
                    "absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-xl transition-all duration-200",
                    isDragging && "cursor-grabbing scale-110 border-rose-400 shadow-2xl"
                  )}
                  onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onTouchStart={(e) => { e.preventDefault(); setIsDragging(true); }}
                  role="slider"
                  aria-valuenow={sliderPosition}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Arrastrar para comparar"
                >
                  <Move className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 rounded bg-black/70 px-2 py-1 text-sm text-white">
                Original
              </div>
              <div className="absolute bottom-4 right-4 rounded bg-rose-500 px-2 py-1 text-sm text-white">
                Mejorado IA
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
