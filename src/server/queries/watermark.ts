

export interface WatermarkConfig {
  enabled: boolean;
  position: string;
  sizePercentage: number;
  opacity: number;
  logoUrl: string;
}

export const getWatermarkConfig = (_accountIdArg?: bigint): WatermarkConfig => {
  return {
  "enabled": true,
  "position": "center",
  "sizePercentage": 70,
  "opacity": 0.3,
  "logoUrl": "https://vesta-crm-prod-eu-e966e353.s3.eu-west-1.amazonaws.com/accounts/21/branding/logo_transparent_1777541776823_nwgzTV.png"
};
}