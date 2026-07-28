

export type ContactProps = {
  title: string;
  subtitle: string;
  messageForm: boolean;
  address: boolean;
  phone: boolean;
  mail: boolean;
  schedule: boolean;
  map: boolean;
  // Contact information fields
  offices: Array<{
    id: string;
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode?: string;
    };
    phoneNumbers: {
      main: string;
      sales?: string;
    };
    emailAddresses: {
      info: string;
      sales?: string;
    };
    scheduleInfo: {
      weekdays: string;
      saturday: string;
      sunday: string;
    };
    mapUrl: string;
    isDefault?: boolean;
  }>;
};

export const getContactProps = (_accountIdArg?: bigint): ContactProps | null => {
  return {
  "map": true,
  "mail": true,
  "phone": true,
  "title": "Contáctanos",
  "address": true,
  "offices": [{
  "id": "OlnINS_CmHQ_Co3xHJmpg",
  "name": "Inmobiliaria Acrópolis León",
  "mapUrl": "https://maps.app.goo.gl/9ronQhh58QpgFezs9",
  "address": {
  "city": "León",
  "state": "León",
  "street": "Calle Velázquez 10, León, 24005, Leon, Leon",
  "country": "España"
},
  "isDefault": true,
  "phoneNumbers": {
  "main": "987218100",
  "sales": ""
},
  "scheduleInfo": {
  "sunday": "Domingos: Cerrado",
  "saturday": "Sábados: 11:00 - 14:00",
  "weekdays": "Lunes a Viernes: Mañana 10:00 - 14:00  Tarde 16:30 - 20:00"
},
  "emailAddresses": {
  "info": "acropolisinmobiliaria.api@gmail.com",
  "sales": ""
}
}, {
  "id": "Km4KdwnVWrJq50Q1aEuPt",
  "name": "Inmobiliaria Acrópolis Benavente",
  "mapUrl": "https://maps.app.goo.gl/ujWWxASWf392gsWH6",
  "address": {
  "city": "Benavente",
  "state": "Zamora",
  "street": "Plaza Santa María 1 - 1º",
  "country": "España"
},
  "isDefault": false,
  "phoneNumbers": {
  "main": "980636364",
  "sales": ""
},
  "scheduleInfo": {
  "sunday": "Domingos: Cerrado",
  "saturday": "Sábados: 11:00 - 14:00",
  "weekdays": "Lunes a Viernes: Mañana 10:00 - 14:00  Tardes 16:45 - 20:15"
},
  "emailAddresses": {
  "info": "acropolis_api@yahoo.es",
  "sales": ""
}
}, {
  "id": "XufjuUjcDPPj5C2irHErM",
  "name": "Inmobiliaria Acrópolis Bilbao",
  "mapUrl": "",
  "address": {
  "city": "Bilbao",
  "state": "País Vasco",
  "street": "",
  "country": "España"
},
  "isDefault": false,
  "phoneNumbers": {
  "main": "",
  "sales": ""
},
  "scheduleInfo": {
  "sunday": "Domingos: Cerrado",
  "saturday": "Sábados: 11:00 - 14:00",
  "weekdays": "Lunes a Viernes: Mañana 10:00 - 14:00  Tarde 17:00 - 20:00"
},
  "emailAddresses": {
  "info": "acropolisbilbao@yahoo.com",
  "sales": ""
}
}],
  "schedule": true,
  "subtitle": "",
  "messageForm": true
};
}

