
import db from "@/lib/db";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: (u) => eq(u.email, email),
    });

    if (user) return user;
  } catch (error) {
    console.log("💩💩💩 error", error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.query.users.findFirst({ where: (u) => eq(u.id, id) });

    if (user) return user;
  } catch (error) {
    console.log("💩💩💩 error", error);
    return null;
  }
};


