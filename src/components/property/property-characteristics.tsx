"use client";

import { useState } from "react";
import {
  Check,
  ArrowUp,
  Thermometer,
  Shield,
  Home as HomeIcon,
  Lock,
  Snowflake,
  Car as CarIcon,
  Building,
  Sun,
  TreePine as TreeIcon,
  Waves as WavesIcon,
  Zap,
  Dumbbell,
  WashingMachine,
  Bath as BathIcon,
  Baby,
  Heart,
  Utensils,
  Wifi,
  ChefHat,
  Microwave,
  Refrigerator,
  Tv,
  Eye,
  TreePine,
  Waves,
  Bus,
  Music,
  Flame,
  X,
  ChevronDown,
  ChevronUp,
  Box,
  Video,
  UserCheck,
  Accessibility,
  Square,
  Satellite,
  Archive,
  Cookie,
  Sofa,
  Wine,
  Shirt,
  Droplet,
  PersonStanding,
  Circle,
  Palmtree,
} from "lucide-react";

interface PropertyCharacteristicsProps {
  property: any;
}

export function PropertyCharacteristics({
  property,
}: PropertyCharacteristicsProps) {
  const [showAllCharacteristics, setShowAllCharacteristics] = useState(false);

  // Debug: log property to see what data we have
  console.log("Property data in PropertyCharacteristics:", property);

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Características</h2>
      <div className="space-y-6">
        {/* Basic Information - Only show if there's data to display */}
        {(property.referenceNumber ||
          property.propertyType ||
          (property.builtSurfaceArea && property.builtSurfaceArea > 0) ||
          property.yearBuilt ||
          property.conservationStatus) && (
          <div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {property.referenceNumber && (
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="font-medium">Referencia</span>
                  <span className="text-sm">{property.referenceNumber}</span>
                </div>
              )}
              {property.propertyType && (
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="font-medium">Tipo de inmueble</span>
                  <span className="text-sm">
                    {property.propertyType === "piso"
                      ? "Piso"
                      : property.propertyType === "casa"
                        ? "Casa"
                        : property.propertyType === "local"
                          ? "Local"
                          : property.propertyType === "solar"
                            ? "Solar"
                            : property.propertyType === "garaje"
                              ? "Garaje"
                              : property.propertyType}
                  </span>
                </div>
              )}
              {property.builtSurfaceArea && property.builtSurfaceArea > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="font-medium">Superficie construida</span>
                  <span className="text-sm">
                    {Number(property.builtSurfaceArea).toLocaleString()} m²
                  </span>
                </div>
              )}
              {property.yearBuilt && (
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="font-medium">Año construcción</span>
                  <span className="text-sm">{property.yearBuilt}</span>
                </div>
              )}
              {property.conservationStatus && (
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="font-medium">Estado conservación</span>
                  <span className="text-sm">
                    {property.conservationStatus === 1
                      ? "Bueno"
                      : property.conservationStatus === 2
                        ? "Muy bueno"
                        : property.conservationStatus === 3
                          ? "Como nuevo"
                          : property.conservationStatus === 4
                            ? "Necesita reforma"
                            : property.conservationStatus === 6
                              ? "Reformado"
                              : property.conservationStatus}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Essential Features - Only show if there are features */}
        {(property.hasElevator ||
          property.hasGarage ||
          property.hasStorageRoom ||
          property.hasHeating ||
          property.airConditioningType ||
          property.terrace ||
          property.garden ||
          property.pool ||
          property.bright ||
          property.exterior) && (
          <div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {property.hasElevator && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <ArrowUp className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Ascensor
                  </span>
                </div>
              )}
              {property.hasGarage && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <CarIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Garaje
                  </span>
                </div>
              )}
              {property.hasStorageRoom && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Box className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Trastero
                  </span>
                </div>
              )}
              {property.hasHeating && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Thermometer className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Calefacción
                  </span>
                </div>
              )}
              {property.airConditioningType && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Snowflake className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Aire Acondicionado
                  </span>
                </div>
              )}
              {property.terrace && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Sun className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Terraza
                  </span>
                </div>
              )}
              {property.garden && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <TreeIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Jardín
                  </span>
                </div>
              )}
              {property.pool && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <WavesIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Piscina
                  </span>
                </div>
              )}
              {property.bright && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Sun className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Luminoso
                  </span>
                </div>
              )}
              {property.exterior && (
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Eye className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Exterior
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional characteristics - Always show */}
        <div className="space-y-6">
          {/* Security Features - Only show if has security features */}
          {(property.alarm ||
            property.securityDoor ||
            property.videoIntercom ||
            property.conciergeService ||
            property.securityGuard) && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Shield className="h-5 w-5 text-primary" />
                Seguridad
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {property.alarm && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Shield className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Alarma
                    </span>
                  </div>
                )}
                {property.securityDoor && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Lock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Puerta Blindada
                    </span>
                  </div>
                )}
                {property.videoIntercom && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Video className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Videoportero
                    </span>
                  </div>
                )}
                {property.conciergeService && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <UserCheck className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Conserjería
                    </span>
                  </div>
                )}
                {property.securityGuard && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Shield className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Vigilancia
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Toggle button for additional characteristics */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowAllCharacteristics(!showAllCharacteristics)}
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>
                {showAllCharacteristics ? "Mostrar menos" : "Ver más características"}
              </span>
              {showAllCharacteristics ? (
                <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              ) : (
                <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              )}
            </button>
          </div>

          {/* Additional characteristics - Hidden by default */}
          {showAllCharacteristics && (
            <>
              {/* Building Features - Only show if has building features */}
              {((property.buildingFloors && property.buildingFloors > 0) ||
            property.orientation ||
            property.mainFloorType ||
            property.windowType ||
            property.shutterType ||
            property.carpentryType ||
            property.doubleGlazing ||
            property.builtInWardrobes ||
            property.disabledAccessible ||
            property.satelliteDish) && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Building className="h-5 w-5 text-primary" />
                Características del Edificio
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {property.buildingFloors && property.buildingFloors > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Plantas del edificio</span>
                    <span className="text-sm">{property.buildingFloors}</span>
                  </div>
                )}
                {property.orientation && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Orientación</span>
                    <span className="text-sm">{property.orientation.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</span>
                  </div>
                )}
                {property.mainFloorType && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Tipo de suelo</span>
                    <span className="text-sm">{property.mainFloorType.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</span>
                  </div>
                )}
                {property.windowType && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Tipo de ventanas</span>
                    <span className="text-sm">{property.windowType.split(' ').map((word: string) => word.toUpperCase() === 'PVC' ? 'PVC' : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</span>
                  </div>
                )}
                {property.shutterType && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Tipo de persianas</span>
                    <span className="text-sm">{property.shutterType.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</span>
                  </div>
                )}
                {property.carpentryType && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Carpintería</span>
                    <span className="text-sm">{property.carpentryType.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {property.doubleGlazing && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Square className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Doble Cristal
                    </span>
                  </div>
                )}
                {property.builtInWardrobes && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Archive className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Armarios Empotr.
                    </span>
                  </div>
                )}
                {property.disabledAccessible && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Accessibility className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Accesible
                    </span>
                  </div>
                )}
                {property.satelliteDish && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Satellite className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Antena Parabólica
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Kitchen Features */}
          {(property.kitchenType ||
            property.openKitchen ||
            property.furnishedKitchen ||
            property.pantry) && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <ChefHat className="h-5 w-5 text-primary" />
                Cocina
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {property.kitchenType && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Tipo de cocina</span>
                    <span className="text-sm">{property.kitchenType.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {property.openKitchen && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <ChefHat className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Cocina Abierta
                    </span>
                  </div>
                )}
                {property.furnishedKitchen && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Sofa className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Cocina Amueblada
                    </span>
                  </div>
                )}
                {property.pantry && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Cookie className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Despensa
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Climate Control */}
          {(property.heatingType ||
            property.hotWaterType ||
            property.airConditioningType) && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Thermometer className="h-5 w-5 text-primary" />
                Climatización
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {property.heatingType && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Tipo de calefacción</span>
                    <span className="text-sm">{property.heatingType}</span>
                  </div>
                )}
                {property.hotWaterType && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Agua caliente</span>
                    <span className="text-sm">{property.hotWaterType}</span>
                  </div>
                )}
                {property.airConditioningType && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Aire acondicionado</span>
                    <span className="text-sm">
                      {property.airConditioningType.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Garage Details */}
          {property.hasGarage &&
            (property.garageType ||
              property.garageSpaces ||
              property.garageNumber) && (
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <CarIcon className="h-5 w-5 text-primary" />
                  Garaje
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {property.garageType && (
                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <span className="font-medium">Tipo de garaje</span>
                      <span className="text-sm">{property.garageType.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</span>
                    </div>
                  )}
                  {property.garageSpaces && (
                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <span className="font-medium">Plazas</span>
                      <span className="text-sm">{property.garageSpaces}</span>
                    </div>
                  )}
                  {property.garageNumber && (
                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <span className="font-medium">Número</span>
                      <span className="text-sm">{property.garageNumber}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {property.garageInBuilding && (
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <Building className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        En Edificio
                      </span>
                    </div>
                  )}
                  {property.elevatorToGarage && (
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <ArrowUp className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Ascensor a Garaje
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Additional Spaces */}
          {((property.terraceSize && property.terraceSize > 0) ||
            property.wineCellar ||
            (property.wineCellarSize && property.wineCellarSize > 0) ||
            (property.livingRoomSize && property.livingRoomSize > 0) ||
            (property.balconyCount && property.balconyCount > 0) ||
            (property.galleryCount && property.galleryCount > 0) ||
            (property.storageRoomSize && property.storageRoomSize > 0)) && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Building className="h-5 w-5 text-primary" />
                Espacios Adicionales
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {property.terraceSize && property.terraceSize > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Tamaño terraza</span>
                    <span className="text-sm">{property.terraceSize} m²</span>
                  </div>
                )}
                {property.livingRoomSize && property.livingRoomSize > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Tamaño salón</span>
                    <span className="text-sm">
                      {property.livingRoomSize} m²
                    </span>
                  </div>
                )}
                {property.storageRoomSize && property.storageRoomSize > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Tamaño trastero</span>
                    <span className="text-sm">
                      {property.storageRoomSize} m²
                    </span>
                  </div>
                )}
                {property.wineCellarSize && property.wineCellarSize > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Tamaño bodega</span>
                    <span className="text-sm">
                      {property.wineCellarSize} m²
                    </span>
                  </div>
                )}
                {property.balconyCount && property.balconyCount > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Balcones</span>
                    <span className="text-sm">{property.balconyCount}</span>
                  </div>
                )}
                {property.galleryCount && property.galleryCount > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Galerías</span>
                    <span className="text-sm">{property.galleryCount}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {property.wineCellar && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Wine className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Bodega
                    </span>
                  </div>
                )}
                {property.laundryRoom && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <WashingMachine className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Lavadero
                    </span>
                  </div>
                )}
                {property.coveredClothesline && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Shirt className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Tendedero Cubierto
                    </span>
                  </div>
                )}
                {property.fireplace && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Flame className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Chimenea
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Luxury & Recreation */}
          {(property.jacuzzi ||
            property.hydromassage ||
            property.gym ||
            property.sportsArea ||
            property.communityPool ||
            property.privatePool ||
            property.tennisCourt ||
            property.childrenArea ||
            property.musicSystem ||
            property.homeAutomation) && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Heart className="h-5 w-5 text-primary" />
                Lujo y Recreación
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {property.jacuzzi && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <WavesIcon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Jacuzzi
                    </span>
                  </div>
                )}
                {property.hydromassage && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Droplet className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Hidromasaje
                    </span>
                  </div>
                )}
                {property.gym && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Dumbbell className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Gimnasio
                    </span>
                  </div>
                )}
                {property.sportsArea && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <PersonStanding className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Zona Deportiva
                    </span>
                  </div>
                )}
                {property.communityPool && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <WavesIcon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Piscina Comunitaria
                    </span>
                  </div>
                )}
                {property.privatePool && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <WavesIcon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Piscina Privada
                    </span>
                  </div>
                )}
                {property.tennisCourt && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Circle className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Pista de Tenis
                    </span>
                  </div>
                )}
                {property.childrenArea && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Baby className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Zona Infantil
                    </span>
                  </div>
                )}
                {property.musicSystem && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Music className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Sistema Musical
                    </span>
                  </div>
                )}
                {property.homeAutomation && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Zap className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Domótica
                    </span>
                  </div>
                )}
                {property.suiteBathroom && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <BathIcon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Baño en Suite
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Views and Location */}
          {(property.views ||
            property.mountainViews ||
            property.seaViews ||
            property.beachfront ||
            property.nearbyPublicTransport) && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Eye className="h-5 w-5 text-primary" />
                Vistas y Ubicación
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {property.views && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Buenas Vistas
                    </span>
                  </div>
                )}
                {property.mountainViews && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <TreePine className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Vista Montaña
                    </span>
                  </div>
                )}
                {property.seaViews && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Waves className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Vista al Mar
                    </span>
                  </div>
                )}
                {property.beachfront && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Palmtree className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Primera Línea
                    </span>
                  </div>
                )}
                {property.nearbyPublicTransport && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Bus className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Transporte Público
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appliances */}
          {(property.internet ||
            property.oven ||
            property.microwave ||
            property.washingMachine ||
            property.fridge ||
            property.tv ||
            property.stoneware) && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Utensils className="h-5 w-5 text-primary" />
                Electrodomésticos
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {property.internet && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Wifi className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Internet
                    </span>
                  </div>
                )}
                {property.oven && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <ChefHat className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Horno
                    </span>
                  </div>
                )}
                {property.microwave && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Microwave className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Microondas
                    </span>
                  </div>
                )}
                {property.washingMachine && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <WashingMachine className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Lavadora
                    </span>
                  </div>
                )}
                {property.fridge && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Refrigerator className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Nevera
                    </span>
                  </div>
                )}
                {property.tv && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Tv className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Televisión
                    </span>
                  </div>
                )}
                {property.stoneware && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Utensils className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Vajilla
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Construction Status */}
          {(property.brandNew ||
            property.newConstruction ||
            property.underConstruction ||
            property.needsRenovation ||
            property.lastRenovationYear) && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Building className="h-5 w-5 text-primary" />
                Estado de Construcción
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {property.brandNew && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Check className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      A Estrenar
                    </span>
                  </div>
                )}
                {property.newConstruction && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Building className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Obra Nueva
                    </span>
                  </div>
                )}
                {property.underConstruction && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Building className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      En Construcción
                    </span>
                  </div>
                )}
                {property.needsRenovation && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <X className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Necesita Reforma
                    </span>
                  </div>
                )}
                {property.lastRenovationYear && (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <Check className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Reformado en {property.lastRenovationYear}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rental Features - Show only for rental properties and only if there are features to show */}
          {(property.listingType === "Rent" ||
            property.listingType === "RentWithOption") &&
            (property.isFurnished ||
              property.furnitureQuality ||
              property.studentFriendly ||
              property.petsAllowed ||
              property.appliancesIncluded ||
              (property.optionalGarage && property.optionalGaragePrice) ||
              (property.optionalStorageRoom &&
                property.optionalStorageRoomPrice)) && (
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <HomeIcon className="h-5 w-5 text-primary" />
                  Condiciones de Alquiler
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {property.isFurnished && (
                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <span className="font-medium">Amueblado</span>
                      <span className="text-sm">Sí</span>
                    </div>
                  )}
                  {property.furnitureQuality && (
                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <span className="font-medium">Calidad mobiliario</span>
                      <span className="text-sm">{property.furnitureQuality}</span>
                    </div>
                  )}
                  {property.studentFriendly && (
                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <span className="font-medium">Admite estudiantes</span>
                      <span className="text-sm">Sí</span>
                    </div>
                  )}
                  {property.petsAllowed && (
                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <span className="font-medium">Admite mascotas</span>
                      <span className="text-sm">Sí</span>
                    </div>
                  )}
                  {property.appliancesIncluded && (
                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <span className="font-medium">
                        Electrodomésticos incluidos
                      </span>
                      <span className="text-sm">Sí</span>
                    </div>
                  )}
                  {property.optionalGarage && property.optionalGaragePrice && (
                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <span className="font-medium">Garaje opcional</span>
                      <span className="text-sm">
                        {Number(property.optionalGaragePrice).toLocaleString()}
                        €/mes
                      </span>
                    </div>
                  )}
                  {property.optionalStorageRoom &&
                    property.optionalStorageRoomPrice && (
                      <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                        <span className="font-medium">Trastero opcional</span>
                        <span className="text-sm">
                          {Number(
                            property.optionalStorageRoomPrice,
                          ).toLocaleString()}
                          €/mes
                        </span>
                      </div>
                    )}
                </div>
              </div>
            )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
