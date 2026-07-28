import type { AboutProps } from "../../lib/data";

export const getAboutProps = (_accountIdArg?: bigint): AboutProps | null => {
  return {
  "title": "Sobre Inmobiliaria Acrópolis",
  "subtitle": "Más de 35 años a tu lado",
  "content": "En Acrópolis, creemos que la decision de comprar una vivienda es fundamental. Es por esto por lo que queremos acompañarte en tu experiencia de la mano.",
  "content2": "Nuestro equipo de profesionales te ayudará paso a paso",
  "services": [{
  "icon": "briefcase",
  "title": "Asesoramiento personalizado"
}, {
  "icon": "calculator",
  "title": "Valoración de inmuebles"
}, {
  "icon": "shield",
  "title": "Servicio de calidad"
}, {
  "icon": "handshake",
  "title": "Asesoramiento de Hipotecas "
}],
  "maxServicesDisplayed": 6,
  "servicesSectionTitle": "Servicios ofrecidos",
  "aboutSectionTitle": "Nuestra visión",
  "buttonName": "Ponte en contacto",
  "showKPI": false,
  "image": "/placeholder-about.jpg",
  "kpi1Data": "+35",
  "kpi1Name": "Años de experiencia",
  "kpi2Data": "500+",
  "kpi2Name": "Hogares encontrados",
  "kpi3Data": "80+",
  "kpi3Name": "Clientes Satisfechos",
  "kpi4Data": "",
  "kpi4Name": ""
};
}
