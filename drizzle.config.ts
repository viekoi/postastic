import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

if (!process.env.NEON_DEV_DB_URL) {
  console.log("🔴 Cannot find database url");
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NEON_DEV_DB_URL || "",
  },
} satisfies Config;
