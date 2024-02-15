import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../../migrations/schema";

if (!process.env.DATABASE_URL) {
  console.log("🔴 no database URL");
}

const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(sql);
const db = drizzle(sql, { schema });

export default db