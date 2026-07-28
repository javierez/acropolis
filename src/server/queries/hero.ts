import type { HeroProps } from "../../lib/data";
import { getContactProps } from "./contact";

export type HeroPropsWithCities = HeroProps & { cities: string[] };

/**
 * Cities used for the homepage rotation and the navbar "Zonas" dropdown.
 * Sourced from the offices configured in `website_config.contact_props`,
 * not from the listings table — this is the authoritative list of cities
 * the agency has a physical presence in.
 */
export const getHeroCities = (_accountId?: bigint): string[] => {
  return ["León", "Benavente", "Bilbao"];
}

// Using React cache to memoize the query
export const getHeroProps = (_accountIdArg?: bigint): HeroProps | null => {
  return {
  "title": "Venta y alquiler de pisos en León",
  "subtitle": "Ayudando a personas a encontrar su hogar desde hace más de 35 años",
  "contactButton": "Ponte en contacto",
  "backgroundType": "video",
  "backgroundImage": "",
  "backgroundVideo": "https://vesta-crm-prod-eu-e966e353.s3.eu-west-1.amazonaws.com/accounts/21/hero/background_1773305280326_5nuEUY.mp4",
  "findPropertyButton": "Encuentra tu casa"
};
}
