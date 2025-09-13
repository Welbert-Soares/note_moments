import "dotenv/config";


export const env = {
  // Server
  PORT: parseInt(process.env.PORT || '3002'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // CORS
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3002'],
  
  // Helpers
  get isDevelopment() {
    return this.NODE_ENV === 'development';
  },
  
  get isProduction() {
    return this.NODE_ENV === 'production';
  }
} as const;
