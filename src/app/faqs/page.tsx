import type { Metadata } from "next";
import Footer from "~/components/footer";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  Home,
  FileText,
  Key,
  Briefcase,
  Scale,
  Monitor,
  ChevronDown,
  Phone,
  Mail,
} from "lucide-react";

interface AccountData {
  legalName: string;
  email: string;
}

// This would typically come from your database/API
async function getAccountData(): Promise<AccountData> {
  // TODO: Replace with actual database query
  // Example: const account = await db.select().from(accounts).where(eq(accounts.accountId, currentAccountId))
  return {
    legalName: "Acropolis Bienes Raíces",
    email: "info@inmobiliariar3.com",
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const accountData = await getAccountData();

  return {
    title: `Preguntas Frecuentes (FAQs) | ${accountData.legalName}`,
    description:
      "Encuentra respuestas a las preguntas más comunes sobre compra, venta y alquiler de propiedades. Resolvemos tus dudas inmobiliarias.",
    robots: {
      index: true,
      follow: true,
    },
  };
}

const getFaqs = async () => {
  const accountData = await getAccountData();

  return [
    {
      category: "Comprar una Propiedad",
      questions: [
        {
          question: "¿Qué documentación necesito para comprar una propiedad?",
          answer:
            "Para comprar una propiedad en España necesitará: NIE (Número de Identificación de Extranjero) si no es ciudadano español, prueba de ingresos (nóminas, declaración de la renta), extractos bancarios de los últimos 3 meses, y pre-aprobación hipotecaria si necesita financiación. También recomendamos contar con un abogado especializado en derecho inmobiliario.",
        },
        {
          question: "¿Cuánto dinero necesito para las arras o señal?",
          answer:
            "Las arras o señal suelen representar entre el 6% y 10% del precio de venta de la propiedad. Este dinero se entrega al firmar el contrato de arras y se descontará del precio final en la escritura pública. Es importante especificar el tipo de arras (confirmatorias, penitenciales o penales) en el contrato.",
        },
        {
          question: "¿Qué gastos adicionales debo considerar al comprar?",
          answer:
            "Los gastos adicionales incluyen: Impuesto de Transmisiones Patrimoniales (ITP) del 6-10% para propiedades usadas o IVA del 10-21% para obra nueva, gastos de notaría (0.1-0.5%), registro de la propiedad (0.1-0.3%), tasación (300-600€), gestoría (300-800€), y abogado (0.5-1% del precio). En total, calcule entre 10-15% del precio de compra.",
        },
        {
          question: "¿Cuánto tiempo toma el proceso de compra?",
          answer:
            "El proceso completo suele tomar entre 6-12 semanas desde la oferta hasta la firma de la escritura. Esto incluye: negociación y firma de arras (1-2 semanas), solicitud y aprobación de hipoteca (3-6 semanas), y preparación de documentación legal (2-3 semanas). Los plazos pueden variar según la complejidad de la operación.",
        },
        {
          question: "¿Qué es la escritura pública y por qué es importante?",
          answer:
            "La escritura pública es el documento legal que formaliza la compraventa ante notario. Es obligatoria para transmitir la propiedad y debe inscribirse en el Registro de la Propiedad para que la compra sea oponible frente a terceros. Sin este documento, la compraventa no tiene validez legal completa.",
        },
      ],
    },
    {
      category: "Vender una Propiedad",
      questions: [
        {
          question: "¿Qué documentos necesito para vender mi propiedad?",
          answer:
            "Necesitará: escritura pública de la propiedad, nota simple del registro de la propiedad (actualizada), certificado energético vigente, recibo del IBI (último pagado), recibos de gastos de comunidad al corriente, cédula de habitabilidad (si es requerida en su comunidad autónoma), y planos de la vivienda si están disponibles.",
        },
        {
          question: "¿Cómo se determina el precio de venta de mi propiedad?",
          answer:
            "El precio se determina mediante un análisis comparativo de mercado que considera: ubicación, tamaño, estado de conservación, características especiales, precios de propiedades similares vendidas recientemente, tendencias del mercado local, y mejoras realizadas. Ofrecemos una valoración gratuita y profesional de su propiedad.",
        },
        {
          question: "¿Cuáles son los gastos de venta para el propietario?",
          answer:
            "Como vendedor, normalmente pagará: comisión inmobiliaria (3-6% + IVA), plusvalía municipal si corresponde (variable según años de tenencia y valor catastral), certificado energético (100-300€), y posibles reparaciones menores recomendadas. En algunos casos también impuestos sobre ganancias patrimoniales.",
        },
        {
          question:
            "¿Qué es un contrato de exclusividad y cuáles son sus ventajas?",
          answer:
            "Un contrato de exclusividad nos otorga el derecho exclusivo de comercializar su propiedad durante un período determinado (típicamente 3-6 meses). Las ventajas incluyen: mayor inversión en marketing, mejor coordinación de visitas, estrategia de venta más enfocada, y generalmente mejores resultados de venta. No hay costes adicionales por la exclusividad.",
        },
        {
          question: "¿Cuánto tiempo tardará en venderse mi propiedad?",
          answer:
            "El tiempo promedio de venta varía entre 3-9 meses, dependiendo de factores como: precio competitivo, ubicación, estado de la propiedad, condiciones del mercado local, y estrategia de marketing. Propiedades bien posicionadas en precio y ubicación premium pueden venderse en 4-8 semanas.",
        },
      ],
    },
    {
      category: "Alquilar una Propiedad",
      questions: [
        {
          question: "¿Qué documentación se requiere para alquilar?",
          answer:
            "Los inquilinos típicamente necesitan: DNI/NIE, nóminas de los últimos 3 meses, contrato de trabajo, declaración de la renta del año anterior, referencias de arrendadores anteriores si las hubiera, y aval bancario o avalista (persona física que garantice el pago). Los ingresos deben ser al menos 3 veces el alquiler mensual.",
        },
        {
          question: "¿Cuánto se paga de fianza y cuándo se devuelve?",
          answer:
            "La fianza legal es de 1 mensualidad para vivienda y 2 para uso diferente. Se deposita en el organismo autonómico correspondiente. Se devuelve al finalizar el contrato, descontando posibles daños o deudas pendientes. En Madrid y otras comunidades también puede requerirse una fianza adicional equivalente a 1-2 mensualidades.",
        },
        {
          question: "¿Cuál es la duración mínima de un contrato de alquiler?",
          answer:
            "Para vivienda habitual, la duración mínima es de 5 años (7 años si el propietario es persona jurídica) según la LAU. El inquilino puede desistir anualmente con 30 días de preaviso. Para alquileres temporales o de temporada, la duración se puede pactar libremente, pero no puede exceder de 11 meses.",
        },
        {
          question: "¿Qué gastos van a cargo del inquilino?",
          answer:
            "Normalmente el inquilino paga: alquiler mensual, suministros (luz, gas, agua), servicios contratados (internet, teléfono), y pequeñas reparaciones por desgaste normal. Los gastos de comunidad pueden ir a cargo del propietario o inquilino según se pacte en el contrato.",
        },
        {
          question: "¿Puedo modificar la propiedad que alquilo?",
          answer:
            "Las modificaciones requieren autorización escrita del propietario. Generalmente se permiten cambios menores y reversibles (pintura, pequeñas mejoras), pero obras que afecten la estructura o instalaciones necesitan consentimiento expreso. Al finalizar el contrato, debe devolverse en el estado original salvo pacto contrario.",
        },
      ],
    },
    {
      category: "Servicios Inmobiliarios",
      questions: [
        {
          question: `¿Qué servicios ofrece ${accountData.legalName}?`,
          answer:
            "Ofrecemos servicios integrales: compra y venta de propiedades, alquiler y gestión de propiedades, valoraciones profesionales, asesoramiento hipotecario, servicios legales especializados, gestión de reformas y mejoras, inversión inmobiliaria, y consultoría para compradores extranjeros. Nuestro equipo multilingüe garantiza atención personalizada.",
        },
        {
          question:
            "¿Cómo garantizan la calidad de las propiedades que comercializan?",
          answer:
            "Todas nuestras propiedades pasan por un proceso de verificación que incluye: visita e inspección técnica, comprobación de documentación legal, verificación de cargas y gravámenes, análisis del estado de conservación, y confirmación de todos los datos proporcionados. Solo comercializamos propiedades con documentación legal en orden.",
        },
        {
          question: "¿Ofrecen financiación o ayuda con hipotecas?",
          answer:
            "Sí, trabajamos con una amplia red de entidades bancarias para ofrecer las mejores condiciones hipotecarias. Nuestros asesores financieros le ayudarán con: pre-aprobación hipotecaria, comparativa de ofertas bancarias, tramitación completa, y negociación de condiciones. Este servicio es gratuito para nuestros clientes.",
        },
        {
          question: "¿Atienden a compradores extranjeros?",
          answer:
            "Absolutamente. Tenemos amplia experiencia con clientes internacionales y ofrecemos: asesoramiento sobre requisitos legales para extranjeros, ayuda con obtención del NIE, explicación del proceso de compra español, servicios de traducción, y coordinación con abogados especializados en derecho internacional. Atendemos en varios idiomas.",
        },
        {
          question: "¿Qué garantías ofrecen en sus servicios?",
          answer:
            "Ofrecemos múltiples garantías: seguro de responsabilidad civil profesional, garantía de satisfacción del cliente, devolución de comisiones en casos específicos, transparencia total en costes y procesos, y seguimiento post-venta. Somos miembros del colegio profesional correspondiente y cumplimos con toda la normativa sectorial.",
        },
      ],
    },
    {
      category: "Legal y Administrativo",
      questions: [
        {
          question: "¿Qué es el NIE y cómo lo obtengo?",
          answer:
            "El NIE (Número de Identificación de Extranjero) es obligatorio para extranjeros que realicen actividades en España, incluyendo compra de propiedades. Se solicita en: comisarías de policía especializadas, oficinas de extranjería, o consulados españoles en el extranjero. Necesitará: formulario EX-15, pasaporte, justificación del motivo (contrato de arras o certificado de interés de compra), y tasa (10.20€).",
        },
        {
          question: "¿Qué impuestos debo pagar al comprar una propiedad?",
          answer:
            "Los impuestos varían según el tipo de propiedad: Vivienda usada: ITP (Impuesto de Transmisiones Patrimoniales) del 6-10% según comunidad autónoma. Vivienda nueva: IVA del 10% (vivienda habitual) o 21% (segunda vivienda) más AJD (0.5-1.5%). También se paga el impuesto municipal sobre el incremento de valor de los terrenos (plusvalía municipal) que normalmente asume el vendedor.",
        },
        {
          question: "¿Necesito un abogado para comprar una propiedad?",
          answer:
            "Aunque no es legalmente obligatorio, es altamente recomendable, especialmente para compradores extranjeros. Un abogado especializado le ayudará con: revisión de contratos, verificación de cargas sobre la propiedad, asesoramiento fiscal, representación en la compraventa, y resolución de posibles problemas legales. Los honorarios suelen ser del 0.5-1% del precio de compra.",
        },
        {
          question: "¿Qué es una nota simple y por qué es importante?",
          answer:
            "La nota simple es un documento emitido por el Registro de la Propiedad que muestra la situación legal actual de una propiedad: propietario actual, cargas, hipotecas, embargos, o cualquier limitación sobre la propiedad. Es fundamental solicitarla antes de comprar para verificar que el vendedor es el legítimo propietario y que no existen cargas ocultas.",
        },
        {
          question:
            "¿Cómo funciona el sistema de registro de la propiedad en España?",
          answer:
            "El Registro de la Propiedad es un organismo público que inscribe y publica los derechos sobre bienes inmuebles. La inscripción: otorga seguridad jurídica, es pública (cualquiera puede consultarla), tiene presunción de exactitud, y protege al propietario registral. Para que una compraventa sea completamente segura, debe inscribirse la nueva escritura de propiedad.",
        },
      ],
    },
    {
      category: "Proceso y Tecnología",
      questions: [
        {
          question: "¿Cómo puedo buscar propiedades en su plataforma?",
          answer:
            "Nuestra plataforma ofrece búsqueda avanzada con filtros por: ubicación (ciudad, barrio, código postal), tipo de propiedad (piso, casa, local, solar, garaje), precio, número de habitaciones y baños, superficie, características especiales, y estado. También puede guardar búsquedas favoritas y recibir alertas de nuevas propiedades que coincidan con sus criterios.",
        },
        {
          question: "¿Ofrecen visitas virtuales de las propiedades?",
          answer:
            "Sí, ofrecemos múltiples opciones: tours virtuales 360°, vídeos profesionales, planos interactivos, fotografías de alta calidad, y visitas virtuales en vivo por videollamada con nuestros agentes. Esto es especialmente útil para compradores internacionales o para hacer una primera selección antes de las visitas presenciales.",
        },
        {
          question: "¿Cómo programo una visita a una propiedad?",
          answer:
            "Puede programar visitas fácilmente: a través de nuestra web usando el formulario de contacto, llamando directamente a nuestro teléfono, enviando un WhatsApp, o a través del chat en línea. Ofrecemos flexibilidad horaria, incluyendo fines de semana y horarios de tarde. Para grupos o visitas múltiples, organizamos tours personalizados.",
        },
        {
          question: "¿Mantienen actualizadas las propiedades disponibles?",
          answer:
            "Sí, actualizamos nuestro inventario en tiempo real. Las propiedades vendidas o alquiladas se retiran inmediatamente de la web. Nuevas propiedades se publican tan pronto como completamos la verificación documental y el reportaje fotográfico. También actualizamos precios y características cuando los propietarios realizan cambios.",
        },
        {
          question:
            "¿Cómo me mantengo informado sobre el mercado inmobiliario?",
          answer:
            "Ofrecemos varios recursos informativos: newsletter mensual con tendencias del mercado, blog con artículos especializados, informes trimestrales de mercado, alertas personalizadas de propiedades, consultas de valoración gratuitas, y asesoramiento personalizado con nuestros expertos. También compartimos información relevante en nuestras redes sociales.",
        },
      ],
    },
  ];
};

const categoryIcons = [
  Home, // Comprar una Propiedad
  FileText, // Vender una Propiedad
  Key, // Alquilar una Propiedad
  Briefcase, // Servicios Inmobiliarios
  Scale, // Legal y Administrativo
  Monitor, // Proceso y Tecnología
];

export default async function FAQsPage() {
  const accountData = await getAccountData();
  const faqs = await getFaqs();

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
              Preguntas Frecuentes
            </li>
          </ol>
        </nav>
      </div>

      {/* Main content with section styling similar to about-section */}
      <section className="pb-12 pt-8 sm:pb-16 lg:pb-24">
        <div className="container">
          {/* Header similar to AboutHeader */}
          <div className="mb-12 flex flex-col items-center text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              Preguntas Frecuentes
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Encuentra respuestas a las preguntas más comunes sobre servicios
              inmobiliarios, procesos de compra, venta y alquiler de
              propiedades.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="mx-auto max-w-4xl space-y-8 sm:space-y-12">
            {faqs.map((category, categoryIndex) => {
              const IconComponent = categoryIcons[categoryIndex] ?? Home;
              return (
                <div key={categoryIndex} className="space-y-4 sm:space-y-6">
                  {/* Category Header */}
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      {category.category}
                    </h2>
                  </div>

                  {/* FAQ Cards */}
                  <div className="space-y-3 sm:space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <Card
                        key={faqIndex}
                        className="border-none shadow-sm transition-all duration-200 hover:shadow-md"
                      >
                        <details className="group">
                          <summary className="cursor-pointer select-none list-none">
                            <CardContent className="flex items-center justify-between p-4 sm:p-6">
                              <h3 className="pr-4 text-base font-medium leading-relaxed sm:text-lg">
                                {faq.question}
                              </h3>
                              <div className="flex-shrink-0">
                                <div className="rounded-full bg-primary/10 p-1.5 transition-colors group-open:bg-primary/20">
                                  <ChevronDown className="h-4 w-4 text-primary transition-transform duration-200 group-open:rotate-180" />
                                </div>
                              </div>
                            </CardContent>
                          </summary>
                          <CardContent className="px-4 pb-4 pt-0 sm:px-6 sm:pb-6">
                            <div className="border-t border-border/40 pt-4">
                              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                                {faq.answer}
                              </p>
                            </div>
                          </CardContent>
                        </details>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact CTA similar to AboutButton pattern */}
          <div className="mt-16 text-center lg:mt-24">
            <Card className="border-none bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 shadow-sm">
              <CardContent className="p-8 sm:p-12">
                <h3 className="mb-4 text-2xl font-bold tracking-tight">
                  ¿No encuentra la respuesta que busca?
                </h3>
                <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-muted-foreground">
                  Nuestro equipo de expertos está aquí para ayudarle con
                  cualquier consulta específica. No dude en contactarnos para
                  recibir asesoramiento personalizado.
                </p>
                <div className="mx-auto flex max-w-md flex-col justify-center gap-3 sm:flex-row sm:gap-4">
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
                      href={`mailto:${accountData.email}`}
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
        </div>
      </section>
      <Footer />
    </main>
  );
}
