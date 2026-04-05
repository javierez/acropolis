
import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { EconomicInfo } from "~/types/property-form";

interface EconomicStepProps {
  data: EconomicInfo;
  updateData: (data: Partial<EconomicInfo>) => void;
  errors: Record<string, string>;
}

export function EconomicStep({ data, updateData, errors }: EconomicStepProps) {
  const [listingType, setListingType] = useState<"venta" | "alquiler">("venta");

  useEffect(() => {
    if (data.precioVenta && !data.precioAlquiler) {
      setListingType("venta");
    } else if (data.precioAlquiler && !data.precioVenta) {
      setListingType("alquiler");
    }
  }, [data.precioVenta, data.precioAlquiler]);

  const handleListingTypeChange = (value: "venta" | "alquiler") => {
    setListingType(value);
    if (value === "venta") {
      updateData({ precioAlquiler: "" });
    } else {
      updateData({ precioVenta: "" });
    }
  };
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Datos Económicos</h2>
        <p className="text-muted-foreground">
          Selecciona si deseas vender o alquilar tu inmueble y proporciona los datos económicos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Toggle Switch for Venta/Alquiler */}
        <div className="space-y-2">
          <div className="flex justify-center mt-6">
            <div className="relative inline-flex items-center rounded-full bg-muted p-2">
              <button
                type="button"
                onClick={() => handleListingTypeChange("venta")}
                className={`relative z-10 rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  listingType === "venta"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Venta
              </button>
              <button
                type="button"
                onClick={() => handleListingTypeChange("alquiler")}
                className={`relative z-10 rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  listingType === "alquiler"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Alquiler
              </button>
            </div>
          </div>
        </div>

        {/* Price Input */}
        {listingType === "venta" ? (
          <div className="space-y-2">
            <Label htmlFor="precioVenta">
              Precio de Venta (€) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="precioVenta"
              type="number"
              value={data.precioVenta}
              onChange={(e) => updateData({ precioVenta: e.target.value })}
              placeholder="Precio de venta"
              className={errors.precioVenta ? "border-red-500" : ""}
            />
            {errors.precioVenta && (
              <p className="text-sm text-red-500">{errors.precioVenta}</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="precioAlquiler">
              Precio de Alquiler (€/mes) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="precioAlquiler"
              type="number"
              value={data.precioAlquiler}
              onChange={(e) => updateData({ precioAlquiler: e.target.value })}
              placeholder="Precio de alquiler mensual"
              className={errors.precioAlquiler ? "border-red-500" : ""}
            />
            {errors.precioAlquiler && (
              <p className="text-sm text-red-500">{errors.precioAlquiler}</p>
            )}
          </div>
        )}

        {listingType === "venta" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="gastosComunitarios">
                Gastos de Comunidad (€/mes)
              </Label>
              <Input
                id="gastosComunitarios"
                type="number"
                value={data.gastosComunitarios}
                onChange={(e) => updateData({ gastosComunitarios: e.target.value })}
                placeholder="Gastos de comunidad"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ibi">IBI (€/año)</Label>
              <Input
                id="ibi"
                type="number"
                value={data.ibi}
                onChange={(e) => updateData({ ibi: e.target.value })}
                placeholder="Impuesto sobre Bienes Inmuebles"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
