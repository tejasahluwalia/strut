function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: (process.env.NODE_ENV || "development") as "development" | "production" | "test",
  PORT: parseInt(process.env.PORT || "44100", 10),
  
  // App secrets
  SESSION_SECRET: process.env.SESSION_SECRET || "default-secret-for-dev",
  
  // Facebook OAuth
  FACEBOOK_APP_ID: requireEnv("FACEBOOK_APP_ID"),
  FACEBOOK_APP_SECRET: requireEnv("FACEBOOK_APP_SECRET"),
  FACEBOOK_CONFIG_ID: requireEnv("FACEBOOK_CONFIG_ID"),
  
  // URLs
  APP_ORIGIN: requireEnv("APP_ORIGIN"),
};
