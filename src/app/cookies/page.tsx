import type { Metadata } from "next";
import Footer from "~/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  Cookie,
  Settings,
  BarChart3,
  Target,
  Palette,
  Shield,
  RefreshCw,
  AlertTriangle,
  Chrome,
  Globe,
  Phone,
  Mail,
} from "lucide-react";

interface AccountData {
  legalName: string;
  privacyEmail: string;
  phone: string;
}

// This would typically come from your database/API
async function getAccountData(): Promise<AccountData> {
  // TODO: Replace with actual database query
  // Example: const account = await db.select().from(accounts).where(eq(accounts.accountId, currentAccountId))
  return {
    legalName: "Acropolis Bienes Raíces",
    privacyEmail: "privacidad@inmobiliariar3.com",
    phone: "+34 91 123 45 67",
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const accountData = await getAccountData();

  return {
    title: `Política de Cookies | ${accountData.legalName}`,
    description:
      "Información sobre el uso de cookies en nuestro sitio web. Gestione sus preferencias de cookies conforme a la normativa vigente.",
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CookiesPage() {
  const accountData = await getAccountData();
  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-8">
        <nav className="py-4" aria-label="Breadcrumb">
          <ol className="flex items-center text-sm">
            <li>
              <Link
                href="/"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Inicio
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="font-medium" aria-current="page">
              Política de Cookies
            </li>
          </ol>
        </nav>
      </div>

      {/* Main content with section styling */}
      <section className="pb-12 pt-8 sm:pb-16 lg:pb-24">
        <div className="container">
          {/* Header */}
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="mb-4 rounded-lg bg-primary/10 p-3">
              <Cookie className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Política de Cookies
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Información sobre el uso de cookies y tecnologías similares en
              nuestro sitio web
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-8 sm:space-y-12">
            {/* What are Cookies */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  ¿Qué son las Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed text-muted-foreground">
                  Las cookies son pequeños archivos de texto que se almacenan en
                  su dispositivo cuando visita un sitio web. Estas cookies
                  permiten que el sitio web recuerde sus acciones y preferencias
                  (como el idioma, tamaño de fuente y otras preferencias de
                  visualización) durante un período de tiempo, para que no tenga
                  que volver a configurarlas cada vez que regrese al sitio o
                  navegue de una página a otra.
                </p>
              </CardContent>
            </Card>

            {/* Why we use cookies */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  ¿Por qué utilizamos Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  Utilizamos cookies para mejorar su experiencia en nuestro
                  sitio web de las siguientes maneras:
                </p>
                <div className="grid gap-2 sm:gap-3">
                  {[
                    "Recordar sus preferencias de búsqueda de propiedades",
                    "Mantener su sesión activa durante la navegación",
                    "Analizar cómo usa nuestro sitio web para mejorarlo",
                    "Personalizar el contenido según sus intereses",
                    "Proporcionar funciones de redes sociales",
                    "Mostrar publicidad relevante",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 rounded-full bg-primary/10 p-1">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground sm:text-base">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Types of Cookies */}
            <div className="space-y-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Tipos de Cookies que Utilizamos
                </h2>
              </div>

              <div className="grid gap-4 sm:gap-6">
                {/* Technical Cookies */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-600 dark:text-green-400">
                      <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      Cookies Técnicas (Esenciales)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 font-medium">Propósito:</p>
                        <p className="text-sm text-muted-foreground">
                          Permiten el funcionamiento básico del sitio web.
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 font-medium">Duración:</p>
                        <p className="text-sm text-muted-foreground">
                          Sesión o hasta 12 meses.
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 font-medium">Ejemplos:</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-xs">
                            sessionId
                          </code>
                          <span className="text-muted-foreground">
                            Mantiene su sesión activa
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-xs">
                            cookieConsent
                          </code>
                          <span className="text-muted-foreground">
                            Recuerda sus preferencias de cookies
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-xs">
                            language
                          </code>
                          <span className="text-muted-foreground">
                            Idioma preferido del sitio
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/10">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        ✅ No requieren consentimiento - Son esenciales para el
                        funcionamiento del sitio
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Analytics Cookies */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                      <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                        <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Cookies de Análisis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 font-medium">Propósito:</p>
                        <p className="text-sm text-muted-foreground">
                          Nos ayudan a entender cómo interactúa con nuestro
                          sitio web.
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 font-medium">Duración:</p>
                        <p className="text-sm text-muted-foreground">
                          Hasta 24 meses.
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 font-medium">Proveedores:</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Google Analytics:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              _ga
                            </code>
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              _ga_*
                            </code>
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              _gid
                            </code>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Hotjar:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              _hjSessionUser_*
                            </code>
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              _hjSession_*
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/10">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        ⚠️ Requieren consentimiento - Puede desactivarlas sin
                        afectar la funcionalidad básica
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Marketing Cookies */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-purple-600 dark:text-purple-400">
                      <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/20">
                        <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      Cookies de Marketing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 font-medium">Propósito:</p>
                        <p className="text-sm text-muted-foreground">
                          Personalizan la publicidad y miden la efectividad de
                          nuestras campañas.
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 font-medium">Duración:</p>
                        <p className="text-sm text-muted-foreground">
                          Entre 30 días y 24 meses.
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 font-medium">Proveedores:</p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Google Ads:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              _gcl_au
                            </code>
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              _gcl_aw
                            </code>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Facebook Pixel:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              _fbp
                            </code>
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              _fbc
                            </code>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">LinkedIn Insight:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              li_*
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/10">
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        ⚠️ Requieren consentimiento - Puede rechazarlas y seguir
                        usando el sitio normalmente
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Preference Cookies */}
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-orange-600 dark:text-orange-400">
                      <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900/20">
                        <Palette className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      Cookies de Preferencias
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-1 font-medium">Propósito:</p>
                        <p className="text-sm text-muted-foreground">
                          Recuerdan sus preferencias para personalizar su
                          experiencia.
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 font-medium">Duración:</p>
                        <p className="text-sm text-muted-foreground">
                          Hasta 12 meses.
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 font-medium">Ejemplos:</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-xs">
                            searchPreferences
                          </code>
                          <span className="text-muted-foreground">
                            Filtros de búsqueda guardados
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-xs">
                            favoriteProperties
                          </code>
                          <span className="text-muted-foreground">
                            Propiedades marcadas como favoritas
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 text-xs">
                            mapView
                          </code>
                          <span className="text-muted-foreground">
                            Preferencias de visualización del mapa
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/10">
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                        ⚠️ Requieren consentimiento - Mejoran su experiencia
                        pero no son esenciales
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Cookie Management */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  Gestión de Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preferences Panel */}
                <Card className="border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-blue-800 dark:text-blue-200">
                      <Cookie className="h-5 w-5" />
                      Panel de Preferencias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-blue-700 dark:text-blue-300">
                      Puede gestionar sus preferencias de cookies en cualquier
                      momento haciendo clic en el botón &quot;Configurar Cookies&quot; que
                      aparece en la parte inferior de nuestro sitio web.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Configurar Cookies
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Restablecer Preferencias
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Browser Configuration */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <Chrome className="h-5 w-5 text-primary" />
                    Configuración del Navegador
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    También puede gestionar las cookies directamente desde la
                    configuración de su navegador:
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                    {[
                      {
                        name: "Chrome",
                        icon: "🌐",
                        path: "Configuración → Privacidad y seguridad → Cookies y otros datos de sitios",
                      },
                      {
                        name: "Firefox",
                        icon: "🦊",
                        path: "Opciones → Privacidad y seguridad → Cookies y datos del sitio",
                      },
                      {
                        name: "Safari",
                        icon: "🧭",
                        path: "Preferencias → Privacidad → Gestionar datos de sitios web",
                      },
                      {
                        name: "Edge",
                        icon: "🌊",
                        path: "Configuración → Privacidad → Cookies y permisos del sitio",
                      },
                    ].map((browser, index) => (
                      <Card
                        key={index}
                        className="border-none shadow-sm transition-shadow hover:shadow-md"
                      >
                        <CardContent className="p-4">
                          <h4 className="mb-2 flex items-center gap-2 font-semibold">
                            <span className="text-lg">{browser.icon}</span>
                            {browser.name}
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {browser.path}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Third Party Cookies */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  Cookies de Terceros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="mb-6 leading-relaxed text-muted-foreground">
                  Algunos de nuestros socios comerciales pueden establecer
                  cookies en su dispositivo cuando visita nuestro sitio web.
                  Estas cookies de terceros están sujetas a las políticas de
                  privacidad de sus respectivos proveedores:
                </p>

                <div className="grid gap-4">
                  {[
                    {
                      name: "Google Analytics & Google Ads",
                      privacy: "https://policies.google.com/privacy",
                      optout: "https://tools.google.com/dlpage/gaoptout",
                      color: "blue",
                    },
                    {
                      name: "Facebook",
                      privacy: "https://www.facebook.com/privacy/policy",
                      optout: "https://www.facebook.com/settings",
                      color: "indigo",
                    },
                    {
                      name: "LinkedIn",
                      privacy: "https://www.linkedin.com/legal/privacy-policy",
                      optout:
                        "https://www.linkedin.com/psettings/guest-controls/retargeting-opt-out",
                      color: "cyan",
                    },
                  ].map((provider, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <h4 className="mb-2 font-semibold">{provider.name}</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            <span className="font-medium">Política:</span>{" "}
                            <a
                              href={provider.privacy}
                              className="text-primary hover:underline"
                              target="_blank"
                              rel="noopener"
                            >
                              {provider.privacy
                                .replace("https://", "")
                                .replace("www.", "")}
                            </a>
                          </p>
                          <p className="text-muted-foreground">
                            <span className="font-medium">Configuración:</span>{" "}
                            <a
                              href={provider.optout}
                              className="text-primary hover:underline"
                              target="_blank"
                              rel="noopener"
                            >
                              {provider.optout
                                .replace("https://", "")
                                .replace("www.", "")}
                            </a>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Consequences of Disabling */}
            <Card className="border-none border-yellow-200 bg-yellow-50 shadow-sm dark:border-yellow-800 dark:bg-yellow-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-yellow-800 dark:text-yellow-200">
                  <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/20">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  Consecuencias de Desactivar Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed text-yellow-700 dark:text-yellow-300">
                  Si decide desactivar las cookies, algunas funcionalidades del
                  sitio web podrían verse afectadas:
                </p>
                <div className="grid gap-2">
                  {[
                    "No se recordarán sus preferencias de búsqueda",
                    "Deberá iniciar sesión cada vez que visite el sitio",
                    "Los formularios podrían perder la información introducida",
                    "No podremos personalizar el contenido según sus intereses",
                    "Los análisis de uso serán menos precisos",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 rounded-full bg-yellow-200 p-1 dark:bg-yellow-800/30">
                        <div className="h-2 w-2 rounded-full bg-yellow-600 dark:bg-yellow-400" />
                      </div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Policy Updates */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <RefreshCw className="h-5 w-5 text-primary" />
                  </div>
                  Actualizaciones de esta Política
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed text-muted-foreground">
                  Esta Política de Cookies puede actualizarse periódicamente
                  para reflejar cambios en nuestras prácticas o por razones
                  operativas, legales o reglamentarias. Le recomendamos que
                  revise esta página regularmente para mantenerse informado
                  sobre nuestro uso de cookies.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  Los cambios importantes serán notificados a través de un aviso
                  prominente en nuestro sitio web o por otros medios apropiados.
                </p>
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <div className="text-center">
              <Card className="border-none bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 shadow-sm">
                <CardContent className="p-8 sm:p-12">
                  <div className="mx-auto mb-4 w-fit rounded-lg bg-primary/10 p-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold tracking-tight">
                    ¿Tiene preguntas sobre nuestra Política de Cookies?
                  </h3>
                  <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-muted-foreground">
                    Nuestro equipo estará encantado de ayudarle con cualquier
                    consulta sobre cookies y privacidad.
                  </p>
                  <div className="mx-auto max-w-sm space-y-3 text-sm">
                    <div className="flex items-center justify-center gap-3">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {accountData.privacyEmail}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="font-medium">{accountData.phone}</span>
                    </div>
                  </div>
                  <div className="mx-auto mt-8 flex max-w-md flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                    <Button size="lg" className="w-full sm:w-auto" asChild>
                      <Link
                        href="/contacto"
                        className="inline-flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        Contactar ahora
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                      asChild
                    >
                      <Link
                        href={`mailto:${accountData.privacyEmail}`}
                        className="inline-flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Enviar email
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Last Updated */}
            <div className="border-t pt-8 text-center text-sm text-muted-foreground">
              <p>
                Última actualización:{" "}
                {new Date().toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
