

export type SocialLink = {
  platform: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube";
  url: string;
};

export const getSocialLinks = (_accountIdArg?: bigint): SocialLink[] => {
  return [{
  "platform": "facebook",
  "url": "https://www.facebook.com/InmobiliariaAcropolisApi/"
}, {
  "platform": "linkedin",
  "url": "https://es.linkedin.com/company/acropolisinmobiliaria"
}];
}