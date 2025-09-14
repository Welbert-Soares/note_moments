import "dotenv/config";


function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}


export const env = {
  // Server
  PORT: parseInt(getEnvVar("PORT")),

  // CORS
  ALLOWED_ORIGINS: getEnvVar("ALLOWED_ORIGINS").split(",") || [
    "http://localhost:3002",
  ],

  // Database
  DATABASE_URL: getEnvVar("DATABASE_URL"),

  // Helpers
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;
