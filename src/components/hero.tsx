import { getHeroProps } from "../server/queries/hero";
import { HeroClient } from "./hero-client";

export default async function Hero() {
  const heroProps = await getHeroProps();

  // Fallbacks in case data is missing
  const title =
    heroProps?.title || "Encuentra Tu Propiedad Soñada Con Acropolis";
  const subtitle =
    heroProps?.subtitle ||
    "Descubre propiedades excepcionales en ubicaciones privilegiadas. Permítenos guiarte en tu viaje inmobiliario.";
  const findPropertyButton =
    heroProps?.findPropertyButton || "Explorar Propiedades";
  const contactButton = heroProps?.contactButton || "Contáctanos";
  const backgroundType = heroProps?.backgroundType || "image";
  const backgroundVideo = heroProps?.backgroundVideo;
  const backgroundImage = heroProps?.backgroundImage;

  return (
    <HeroClient
      title={title}
      subtitle={subtitle}
      findPropertyButton={findPropertyButton}
      contactButton={contactButton}
      backgroundType={backgroundType}
      backgroundVideo={backgroundVideo}
      backgroundImage={backgroundImage}
    />
  );
}
