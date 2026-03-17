

export interface WatermarkConfig {
  enabled: boolean;
  position: string;
  sizePercentage: number;
  opacity: number;
  logoUrl: string;
}

export const getWatermarkConfig = (): WatermarkConfig => {
  return {
  "enabled": true,
  "position": "center",
  "sizePercentage": 50,
  "opacity": 0.4,
  "logoUrl": "https://javier-gonzalez.s3.us-east-1.amazonaws.com/branding/logo_transparent_1773621954905_3Nkw12.png"
};
}