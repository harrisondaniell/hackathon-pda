import "dotenv/config";
import { coerce, z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  JWT_SECRET: z.coerce.string().default("123"),
  PORT: z.coerce.number().default(3333),
  FRONT_URL: z.coerce.string().default("http://localhost:3000"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
