import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof postgres> | undefined;
};

// Create PostgreSQL connection with Supabase
const conn =
  globalForDb.conn ??
  postgres(env.POSTGRES_URL, {
    ssl: env.NODE_ENV === "production" ? "require" : "prefer",
    max: 10, // Connection pool size
    idle_timeout: 20,
    max_lifetime: 60 * 30, // 30 minutes
  });

// Cache connection in development to avoid HMR reconnections
if (env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
}

// Test connection on startup
conn`SELECT 1`
  .then(() => console.log("✅ Database connected"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

export const db = drizzle(conn, { schema });
