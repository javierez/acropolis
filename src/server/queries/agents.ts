import { cache } from "react";
import { db } from "~/server/db";
import { users, userRoles } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Get the admin agent ID for property listing assignment
 * Returns the specific admin user who will handle initial property distribution
 * Falls back to any available agent if admin agent is not found
 */
export const getAdminAgent = cache(async (): Promise<string> => {
  try {
    // First try to get the specific admin agent
    const [adminAgent] = await db
      .select({ id: users.id })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .where(
        and(
          eq(users.id, "CoRtMBo1GtjvJd1y0JHNN6Nr8Ms99yYm"),
          eq(userRoles.roleId, 3n) // BigInt for role_id = 3
        )
      )
      .limit(1);

    if (adminAgent) {
      return adminAgent.id;
    }

    // Fallback: Get any available agent (user with role_id = 3)
    console.log("Admin agent not found, falling back to any available agent");
    const [fallbackAgent] = await db
      .select({ id: users.id })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .where(eq(userRoles.roleId, 3n))
      .limit(1);

    if (fallbackAgent) {
      console.log(`Using fallback agent: ${fallbackAgent.id}`);
      return fallbackAgent.id;
    }

    throw new Error("No agents found with the required role permissions");
  } catch (error) {
    console.error("Failed to get admin agent:", error);
    throw new Error(
      `Unable to assign listing to any agent: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
});