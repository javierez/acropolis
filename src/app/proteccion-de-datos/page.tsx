import type { Metadata } from "next";
import Footer from "~/components/footer";

export const metadata: Metadata = {
  title: "Política de Protección de Datos | Acropolis Bienes Raíces",
  description:
    "Política de privacidad y protección de datos personales conforme al RGPD. Información sobre el tratamiento de sus datos.",
  robots: {
    index: true,
    follow: true,
  },
};

interface AccountData {
  legalName: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  privacyEmail: string;
  dpoEmail: string;
}

// This would typically come from your database/API
async function getAccountData(): Promise<AccountData> {
  // TODO: Replace with actual database query
  // Example: const account = await db.select().from(accounts).where(eq(accounts.accountId, currentAccountId))
  return {
    legalName: "Acropolis Bienes Raíces S.L.",
    taxId: "B-12345678",
    address: "Calle Ejemplo, 123, 28001 Madrid, España",
    phone: "+34 91 123 45 67",
    email: "info@inmobiliariar3.com",
    privacyEmail: "privacidad@inmobiliariar3.com",
    dpoEmail: "dpo@inmobiliariar3.com",
  };
}

export default async function ProteccionDatosPage() {
  const accountData = await getAccountData();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">
            Política de Protección de Datos
          </h1>
          <p className="text-lg text-muted-foreground">
            Información sobre el tratamiento de datos personales conforme al
            Reglamento General de Protección de Datos (RGPD)
          </p>
        </div>

        <div className="prose prose-gray max-w-none dark:prose-invert">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Responsable del Tratamiento
            </h2>
            <ul className="mb-4 space-y-2">
              <li>
                <strong>Denominación:</strong> {accountData.legalName}
              </li>
              <li>
                <strong>CIF:</strong> {accountData.taxId}
              </li>
              <li>
                <strong>Domicilio:</strong> {accountData.address}
              </li>
              <li>
                <strong>Email:</strong> {accountData.privacyEmail}
              </li>
              <li>
                <strong>Teléfono:</strong> {accountData.phone}
              </li>
              <li>
                <strong>Delegado de Protección de Datos (DPD):</strong>{" "}
                {accountData.dpoEmail}
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Finalidades del Tratamiento
            </h2>

            <h3 className="mb-3 text-xl font-semibold">
              1. Servicios Inmobiliarios
            </h3>
            <p className="mb-4">
              <strong>Datos tratados:</strong> Datos de contacto, preferencias
              inmobiliarias, situación económica, documentación de
              identificación.
            </p>
            <p className="mb-4">
              <strong>Base legal:</strong> Ejecución de contrato y
              consentimiento del interesado.
            </p>
            <p className="mb-4">
              <strong>Finalidad:</strong> Gestionar la compra, venta o alquiler
              de propiedades, búsqueda de inmuebles que se ajusten a sus
              necesidades, gestión de visitas y seguimiento comercial.
            </p>

            <h3 className="mb-3 text-xl font-semibold">
              2. Comunicaciones Comerciales
            </h3>
            <p className="mb-4">
              <strong>Datos tratados:</strong> Email, teléfono, preferencias
              comerciales.
            </p>
            <p className="mb-4">
              <strong>Base legal:</strong> Consentimiento específico del
              interesado.
            </p>
            <p className="mb-4">
              <strong>Finalidad:</strong> Envío de información sobre nuevas
              propiedades, ofertas especiales y noticias del sector
              inmobiliario.
            </p>

            <h3 className="mb-3 text-xl font-semibold">3. Gestión de la Web</h3>
            <p className="mb-4">
              <strong>Datos tratados:</strong> Datos de navegación, cookies
              técnicas, IP.
            </p>
            <p className="mb-4">
              <strong>Base legal:</strong> Interés legítimo.
            </p>
            <p className="mb-4">
              <strong>Finalidad:</strong> Funcionamiento del sitio web, análisis
              de uso y mejora de servicios.
            </p>

            <h3 className="mb-3 text-xl font-semibold">
              4. Atención al Cliente
            </h3>
            <p className="mb-4">
              <strong>Datos tratados:</strong> Datos de contacto, consultas
              realizadas.
            </p>
            <p className="mb-4">
              <strong>Base legal:</strong> Interés legítimo y ejecución
              precontractual.
            </p>
            <p className="mb-4">
              <strong>Finalidad:</strong> Gestión de consultas, reclamaciones y
              atención al cliente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Conservación de Datos
            </h2>
            <ul className="mb-4 space-y-3">
              <li>
                <strong>Servicios inmobiliarios:</strong> Durante la relación
                contractual y 6 años adicionales para el cumplimiento de
                obligaciones legales.
              </li>
              <li>
                <strong>Comunicaciones comerciales:</strong> Hasta que retire el
                consentimiento.
              </li>
              <li>
                <strong>Datos de navegación:</strong> Máximo 24 meses desde la
                última visita.
              </li>
              <li>
                <strong>Consultas y reclamaciones:</strong> 3 años desde la
                resolución del asunto.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Comunicación de Datos
            </h2>
            <p className="mb-4">Sus datos podrán ser comunicados a:</p>
            <ul className="mb-4 space-y-2">
              <li>
                • <strong>Entidades bancarias:</strong> Para tramitación de
                hipotecas y financiación
              </li>
              <li>
                • <strong>Notarías y registros:</strong> Para formalización de
                operaciones
              </li>
              <li>
                • <strong>Administraciones públicas:</strong> Cuando sea
                legalmente exigible
              </li>
              <li>
                • <strong>Portales inmobiliarios:</strong> Para publicación de
                propiedades (previo consentimiento)
              </li>
              <li>
                • <strong>Proveedores de servicios:</strong> Plataformas
                tecnológicas, servicios de marketing (bajo acuerdos de encargo
                de tratamiento)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Transferencias Internacionales
            </h2>
            <p className="mb-4">
              En caso de utilizar servicios tecnológicos ubicados fuera del
              Espacio Económico Europeo, nos aseguramos de que existan garantías
              adecuadas de protección mediante:
            </p>
            <ul className="mb-4 space-y-1">
              <li>• Decisiones de adecuación de la Comisión Europea</li>
              <li>
                • Cláusulas contractuales tipo aprobadas por la Comisión Europea
              </li>
              <li>
                • Certificaciones de privacidad reconocidas internacionalmente
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Sus Derechos</h2>
            <p className="mb-4">Como titular de los datos, tiene derecho a:</p>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold">🔍 Acceso</h4>
                <p className="text-sm">
                  Conocer qué datos tratamos sobre usted
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">✏️ Rectificación</h4>
                <p className="text-sm">
                  Modificar datos inexactos o incompletos
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">🗑️ Supresión</h4>
                <p className="text-sm">
                  Eliminar sus datos cuando no sean necesarios
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">⏸️ Limitación</h4>
                <p className="text-sm">
                  Restringir el tratamiento de sus datos
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">📤 Portabilidad</h4>
                <p className="text-sm">
                  Recibir sus datos en formato estructurado
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">❌ Oposición</h4>
                <p className="text-sm">Oponerse al tratamiento de sus datos</p>
              </div>
            </div>

            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
              <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
                📧 Cómo ejercer sus derechos
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Puede ejercer estos derechos enviando un email a{" "}
                <strong>{accountData.privacyEmail}</strong>{" "}
                adjuntando copia de su DNI o documento identificativo
                equivalente.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Medidas de Seguridad
            </h2>
            <p className="mb-4">
              Hemos implementado medidas técnicas y organizativas apropiadas
              para proteger sus datos personales:
            </p>
            <ul className="mb-4 space-y-2">
              <li>
                • <strong>Cifrado:</strong> Comunicaciones SSL/TLS en toda la
                plataforma
              </li>
              <li>
                • <strong>Acceso restringido:</strong> Solo personal autorizado
                accede a los datos
              </li>
              <li>
                • <strong>Copias de seguridad:</strong> Respaldos regulares con
                cifrado
              </li>
              <li>
                • <strong>Formación:</strong> El personal recibe formación
                regular en protección de datos
              </li>
              <li>
                • <strong>Auditorías:</strong> Revisiones periódicas de
                seguridad
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Menores de Edad</h2>
            <p className="mb-4">
              Nuestros servicios están dirigidos a personas mayores de 14 años.
              Si eres menor de 14 años, necesitas el consentimiento de tus
              padres o tutores para utilizar nuestros servicios.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Reclamaciones</h2>
            <p className="mb-4">
              Si considera que el tratamiento de sus datos personales vulnera la
              normativa de protección de datos, puede presentar una reclamación
              ante la Agencia Española de Protección de Datos (AEPD):
            </p>
            <ul className="mb-4 space-y-1">
              <li>
                <strong>Web:</strong> www.aepd.es
              </li>
              <li>
                <strong>Dirección:</strong> C/ Jorge Juan, 6, 28001 Madrid
              </li>
              <li>
                <strong>Teléfono:</strong> 901 100 099 - 912 663 517
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Modificaciones</h2>
            <p className="mb-4">
              Esta Política de Protección de Datos puede ser modificada para
              adaptarse a cambios normativos o mejoras en nuestros servicios.
              Las modificaciones serán comunicadas con la debida antelación a
              través de nuestro sitio web.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Contacto</h2>
            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
              <h4 className="mb-4 font-semibold">
                Delegado de Protección de Datos (DPD)
              </h4>
              <ul className="space-y-1">
                <li>
                  <strong>Email:</strong> {accountData.dpoEmail}
                </li>
                <li>
                  <strong>Teléfono:</strong> {accountData.phone}
                </li>
                <li>
                  <strong>Dirección:</strong> {accountData.address}
                </li>
              </ul>
            </div>
          </section>

          <div className="mt-12 border-t pt-8 text-sm text-muted-foreground">
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
      <Footer />
    </main>
  );
}
