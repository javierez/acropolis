import { getListingsForGrid } from "~/server/queries/listings";
import { getPropertiesConfig } from "~/server/queries/website-config";
import { getWatermarkConfig } from "~/server/queries/watermark";
import { PropertyHeader } from "./propertygrid/PropertyHeader";
import { PropertyGridContent } from "./propertygrid/PropertyGridContent";
import { PropertyButton } from "./propertygrid/PropertyButton";
import { PropertyGridWrapper } from "./propertygrid/PropertyGridWrapper";

export async function PropertyGrid({ accountId }: { accountId?: bigint } = {}) {
  // Fetch listings and configuration data from the database
  const [listings, config, watermarkConfig] = await Promise.all([
    getListingsForGrid(12, accountId),
    getPropertiesConfig(accountId),
    getWatermarkConfig(accountId),
  ]);

  const { title, subtitle, buttonText, showDescription, showReference, cardDisplay } = config;
  const watermarkEnabled = watermarkConfig.enabled && !!watermarkConfig.logoUrl;

  return (
    <PropertyGridWrapper>
      <section className="pb-4 pt-16 sm:pb-8 lg:pb-12" id="properties">
        <div className="container">
          <PropertyHeader title={title} subtitle={subtitle} />
          <PropertyGridContent listings={listings} watermarkEnabled={watermarkEnabled} showDescription={showDescription} showReference={showReference} cardDisplay={cardDisplay} />
          {listings.length > 0 && <PropertyButton text={buttonText} />}
        </div>
      </section>
    </PropertyGridWrapper>
  );
}
