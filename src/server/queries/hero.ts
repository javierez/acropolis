import type { HeroProps } from "../../lib/data";

// Using React cache to memoize the query
export const getHeroProps = (): HeroProps | null => {
  return {
  "title": "Venta y alquiler de pisos en León",
  "subtitle": "Ayudando a personas a encontrar su hogar desde hace más de 35 años",
  "backgroundImage": "",
  "backgroundVideo": "https://javier-gonzalez.s3.us-east-1.amazonaws.com/hero/background_1773305280326_5nuEUY.mp4",
  "backgroundType": "video",
  "findPropertyButton": "Encuentra tu casa",
  "contactButton": "Ponte en contacto"
};
}
