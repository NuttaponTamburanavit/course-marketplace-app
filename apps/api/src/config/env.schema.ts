import { z } from "zod";

export const EnvSchema = z.object({
  APP_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  OMISE_PUBLIC_KEY: z.string().min(1),
  OMISE_SECRET_KEY: z.string().min(1),
  SENDGRID_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().email(),
});

export type Env = z.infer<typeof EnvSchema>;
