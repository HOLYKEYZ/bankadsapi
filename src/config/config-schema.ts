import * as z from "zod";

export const envConfig = z.object({
  PORT: z.string("PORT environment variable is required"),
  MONGODB_URI: z.string("MONGODB_URI environment variable is required"),
  JWT_SECRET: z.string("JWT_SECRET environment variable is required").min(90),
});

export default envConfig;

export type Config = z.infer<typeof envConfig>;
