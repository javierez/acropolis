import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Cinzel } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { WhatsAppButton } from "~/components/ui/whatsapp-button";
import Navbar from "~/components/navbar";
import { getLogo } from "~/server/queries/logo";
import { getSEOConfig } from "~/server/queries/website-config";
import { getSocialLinks } from "~/server/queries/social";
import { getContactProps } from "~/server/queries/contact";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const seoConfig = await getSEOConfig();

  return {
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    openGraph: {
      title: seoConfig.ogTitle || seoConfig.title,
      description: seoConfig.ogDescription || seoConfig.description,
      url: seoConfig.ogUrl,
      siteName: seoConfig.ogSiteName,
      images: [
        {
          url: seoConfig.ogImage || "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: seoConfig.ogSiteName || seoConfig.name || "Real Estate",
        },
      ],
      locale: seoConfig.ogLocale || "es_ES",
      type: (seoConfig.ogType || "website") as "website",
    },
    generator: "v0.dev",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const logoUrl = await getLogo();
  const socialLinks = await getSocialLinks();
  const contactProps = await getContactProps();
  const defaultOffice = contactProps?.offices?.find(office => office.isDefault) || contactProps?.offices?.[0];
  const whatsappPhone = defaultOffice?.phoneNumbers?.sales?.replace(/[\s\-\(\)]/g, '') || null;
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geist.variable} ${cinzel.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col overflow-x-hidden">
            <Navbar
              shortName="Acropolis"
              logoUrl={logoUrl}
              socialLinks={socialLinks}
            />
            <main className="flex-1">{children}</main>
            <WhatsAppButton phoneNumber={whatsappPhone} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
