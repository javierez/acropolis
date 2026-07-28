"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Building2,
  Store,
  LandPlot,
  Car,
  PlusCircle,
  Search,
  ExternalLink,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback, memo, useEffect } from "react";
import { cn, hexToRgba } from "~/lib/utils";
import { SocialLinks } from "~/components/ui/social-links";
import {
  isAccount137,
  ACCOUNT_137_NAV_LINK_COLOR,
} from "~/lib/account-overrides/137";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

// Types
type SocialPlatform =
  | "facebook"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "youtube";

interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

// `vender` and `alquilar` apply in the v1 template — it has no "Segunda mano"/
// "Inversión" menu items, so the other features_props.menuLabels fields are
// ignored here.
interface NavbarMenuLabels {
  vender?: string;
  alquilar?: string;
}

interface NavbarProps {
  socialLinks?: SocialLink[];
  shortName?: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  promotionsEnabled?: boolean;
  hasServiciosPage?: boolean;
  hasNosotrosPage?: boolean;
  menuLabels?: NavbarMenuLabels;
  logoSize?: "standard" | "large" | "xlarge";
  /** Show the "Buscar por referencia" search. Default true. */
  referenceSearch?: boolean;
}

// Memoized Social Links Section
const MobileSocialLinks = memo(({ links }: { links: SocialLink[] }) => (
  <div className="border-t bg-muted/50 backdrop-blur-sm">
    <div className="px-4 py-4">
      <div className="mb-3 text-xs font-medium text-muted-foreground">
        Síguenos en redes sociales
      </div>
      <SocialLinks links={links} />
    </div>
  </div>
));

MobileSocialLinks.displayName = "MobileSocialLinks";

// Main Component
export default function Navbar({
  socialLinks,
  shortName,
  logoUrl,
  primaryColor,
  promotionsEnabled = false,
  hasServiciosPage = false,
  hasNosotrosPage = false,
  menuLabels,
  logoSize = "standard",
  referenceSearch = true,
}: NavbarProps): React.ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchRef, setSearchRef] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Interior pages with their own hero banner (servicios/nosotros) overlay the
  // navbar; a transparent bar reads as a glitch there, so render it solid with
  // the brand colour (falls back to the default solid background when unset).
  const solidNav =
    pathname?.startsWith("/servicios") || pathname?.startsWith("/nosotros");

  // Account 137 (Ana Díaz): bold, dark-green desktop nav links. Scoped here so
  // no other generated site is affected. `font-bold` overrides the default
  // `font-medium`; the green colour is set on <nav> below and inherited.
  const acct137 = isAccount137();
  const navLinkWeight = acct137 ? "font-bold" : "font-medium";
  const navLinkSize = acct137 ? "text-base" : "text-sm";
  const navStyle = acct137 ? { color: ACCOUNT_137_NAV_LINK_COLOR } : undefined;

  // Config-driven (features_props); defaults preserve prior copy/size.
  const venderLabel = menuLabels?.vender ?? "Vender";
  const alquilarLabel = menuLabels?.alquilar ?? "Alquilar";
  const logoSizeClass =
    logoSize === "xlarge"
      ? "h-24 w-64"
      : logoSize === "large"
        ? "h-20 w-52"
        : "h-16 w-40";
  const showRefSearch = referenceSearch !== false;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoized handlers
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleMenuClose();
      }
    },
    [handleMenuClose],
  );

  const handleRefSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = searchRef.trim();
      if (trimmed) {
        router.push(`/propiedades/${trimmed}`);
        setSearchRef("");
      }
    },
    [searchRef, router],
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        !isMenuOpen && "border-b backdrop-blur",
        !isMenuOpen &&
          !primaryColor &&
          (solidNav
            ? "bg-background"
            : "bg-background/95 supports-[backdrop-filter]:bg-background/60"),
      )}
      style={
        !isMenuOpen && primaryColor
          ? {
              backgroundColor:
                (solidNav
                  ? hexToRgba(primaryColor, 1)
                  : hexToRgba(primaryColor, 0.2)) ?? undefined,
            }
          : undefined
      }
      onKeyDown={handleKeyPress}
    >
      <div
        className={cn(
          "container mx-auto h-16 items-center justify-between px-4 sm:h-18 sm:px-6",
          isMenuOpen ? "hidden lg:flex" : "flex",
        )}
      >
        {/* Left section - Logo. Account 137 (Ana Díaz) hides it on mobile,
            keeping it from lg up. */}
        <div className={cn("flex-shrink-0", acct137 && "hidden lg:block")}>
          <Link href="/" className="flex items-center gap-2" aria-label="Home">
            <div className={cn("relative", logoSizeClass)}>
              <Image
                src={logoUrl ?? "/vestazoomin.jpeg"}
                alt={shortName || "Vesta CRM Logo"}
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Center section - Navigation */}
        <nav
          className="hidden gap-4 lg:flex xl:gap-6"
          aria-label="Main navigation"
          style={navStyle}
        >
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-1 transition-colors hover:text-primary",
                  navLinkSize,
                  navLinkWeight,
                )}
                aria-label="Comprar opciones"
              >
                Comprar <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem>
                  <Link
                    href="/venta-pisos/todas-ubicaciones"
                    className="w-full"
                  >
                    Pisos en venta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/venta-casas/todas-ubicaciones"
                    className="w-full"
                  >
                    Casas en venta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/venta-locales/todas-ubicaciones"
                    className="w-full"
                  >
                    Locales en venta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/venta-solares/todas-ubicaciones"
                    className="w-full"
                  >
                    Terrenos en venta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/venta-garajes/todas-ubicaciones"
                    className="w-full"
                  >
                    Garajes en venta
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span
              className={cn(
                "flex items-center gap-1",
                navLinkSize,
                navLinkWeight,
              )}
            >
              Comprar <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </span>
          )}

          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-1 transition-colors hover:text-primary",
                  navLinkSize,
                  navLinkWeight,
                )}
                aria-label={`${alquilarLabel} opciones`}
              >
                {alquilarLabel} <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem>
                  <Link
                    href="/alquiler-pisos/todas-ubicaciones"
                    className="w-full"
                  >
                    Pisos en alquiler
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/alquiler-casas/todas-ubicaciones"
                    className="w-full"
                  >
                    Casas en alquiler
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/alquiler-locales/todas-ubicaciones"
                    className="w-full"
                  >
                    Locales en alquiler
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/alquiler-solares/todas-ubicaciones"
                    className="w-full"
                  >
                    Terrenos en alquiler
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/alquiler-garajes/todas-ubicaciones"
                    className="w-full"
                  >
                    Garajes en alquiler
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span
              className={cn(
                "flex items-center gap-1",
                navLinkSize,
                navLinkWeight,
              )}
            >
              {alquilarLabel} <ChevronDown className="h-3.5 w-3.5 opacity-50" />
            </span>
          )}

          {promotionsEnabled && (
            <Link
              href="/promociones"
              className={cn(
                "transition-colors hover:text-primary",
                navLinkSize,
                navLinkWeight,
              )}
              aria-label="Promociones"
            >
              Promociones
            </Link>
          )}
          <Link
            href="/vender"
            className={cn(
              "transition-colors hover:text-primary",
              navLinkSize,
              navLinkWeight,
            )}
            aria-label="Vender propiedad"
          >
            {venderLabel}
          </Link>
          {hasServiciosPage && !acct137 && (
            <Link
              href="/servicios"
              className={cn(
                "transition-colors hover:text-primary",
                navLinkSize,
                navLinkWeight,
              )}
              aria-label="Servicios"
            >
              Servicios
            </Link>
          )}
          <Link
            href={hasNosotrosPage ? "/nosotros" : "/#about"}
            className={cn(
              "transition-colors hover:text-primary",
              navLinkSize,
              navLinkWeight,
            )}
            aria-label="Sobre nosotros"
          >
            Nosotros
          </Link>
          <Link
            href="/#contact"
            className={cn(
              "transition-colors hover:text-primary",
              navLinkSize,
              navLinkWeight,
            )}
            aria-label="Contacto"
          >
            Contacto
          </Link>
          <Link
            href="/enlaces-de-interes"
            className={cn(
              "transition-colors hover:text-primary",
              navLinkSize,
              navLinkWeight,
            )}
            aria-label="Enlaces de interés"
          >
            Enlaces de interés
          </Link>
        </nav>

        {/* Right section - Search, Social Links and Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Reference Search */}
          {showRefSearch && (
            <form onSubmit={handleRefSearch} className="hidden sm:flex">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  placeholder="Busca por referencia"
                  className="h-8 w-40 rounded-md border border-input bg-white pl-7 pr-2 text-xs transition-all placeholder:text-muted-foreground focus:w-44 focus:outline-none focus:ring-1 focus:ring-ring"
                  aria-label="Buscar por referencia"
                />
              </div>
            </form>
          )}
          <div className="hidden lg:flex">
            {socialLinks && socialLinks.length > 0 && (
              <SocialLinks links={socialLinks} />
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={handleMenuToggle}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-50 w-full bg-background shadow-2xl transition-transform duration-300 ease-in-out lg:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex h-full flex-col">
          {/* Close button */}
          <div className="flex h-16 items-center justify-end px-4 sm:h-18 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMenuClose}
              aria-label="Cerrar menú"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6 px-4 py-6">
              {/* Mobile Reference Search */}
              {showRefSearch && (
                <form onSubmit={handleRefSearch} className="sm:hidden">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchRef}
                      onChange={(e) => setSearchRef(e.target.value)}
                      placeholder="Buscar por referencia..."
                      className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      aria-label="Buscar por referencia"
                    />
                  </div>
                </form>
              )}

              {/* Comprar Section */}
              <div className="space-y-3">
                <h3 className="px-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Comprar
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/venta-pisos/todas-ubicaciones"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    <Home className="h-4 w-4" />
                    Pisos
                  </Link>
                  <Link
                    href="/venta-casas/todas-ubicaciones"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    <Building2 className="h-4 w-4" />
                    Casas
                  </Link>
                  <Link
                    href="/venta-locales/todas-ubicaciones"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    <Store className="h-4 w-4" />
                    Locales
                  </Link>
                  <Link
                    href="/venta-solares/todas-ubicaciones"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    <LandPlot className="h-4 w-4" />
                    Terrenos
                  </Link>
                  <Link
                    href="/venta-garajes/todas-ubicaciones"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    <Car className="h-4 w-4" />
                    Garajes
                  </Link>
                </div>
              </div>

              {/* Alquilar Section */}
              <div className="space-y-3">
                <h3 className="px-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {alquilarLabel}
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/alquiler-pisos/todas-ubicaciones"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    <Home className="h-4 w-4" />
                    Pisos
                  </Link>
                  <Link
                    href="/alquiler-casas/todas-ubicaciones"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    <Building2 className="h-4 w-4" />
                    Casas
                  </Link>
                  <Link
                    href="/alquiler-locales/todas-ubicaciones"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    <Store className="h-4 w-4" />
                    Locales
                  </Link>
                  <Link
                    href="/alquiler-solares/todas-ubicaciones"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    <LandPlot className="h-4 w-4" />
                    Terrenos
                  </Link>
                  <Link
                    href="/alquiler-garajes/todas-ubicaciones"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    <Car className="h-4 w-4" />
                    Garajes
                  </Link>
                </div>
              </div>

              {/* Other Links */}
              <div className="space-y-3">
                <h3 className="px-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Más
                </h3>
                <div className="space-y-1">
                  {promotionsEnabled && (
                    <Link
                      href="/promociones"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={handleMenuClose}
                    >
                      <Building2 className="h-4 w-4" />
                      Promociones
                    </Link>
                  )}
                  <Link
                    href="/vender"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    <PlusCircle className="h-4 w-4" />
                    {venderLabel}
                  </Link>
                  {hasServiciosPage && !acct137 && (
                    <Link
                      href="/servicios"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={handleMenuClose}
                    >
                      Servicios
                    </Link>
                  )}
                  <Link
                    href={hasNosotrosPage ? "/nosotros" : "/#about"}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    Nosotros
                  </Link>
                  <Link
                    href="/#contact"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    Contacto
                  </Link>
                  <Link
                    href="/enlaces-de-interes"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    onClick={handleMenuClose}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Enlaces de interés
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Footer */}
          {socialLinks && socialLinks.length > 0 && (
            <MobileSocialLinks links={socialLinks} />
          )}
        </div>
      </div>
    </header>
  );
}
