import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema";

const connectionString =
  process.env.NODE_ENV === "production"
    ? process.env.NEON_PROD_DB_URL
    : process.env.NEON_DEV_DB_URL;

if (!connectionString) {
  console.log("🔴 no database URL");
}

const sql = neon(connectionString!);
// export const db = drizzle(sql);
const db = drizzle(sql, { schema });

export default db;
