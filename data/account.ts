import db from "@/lib/db";
import { eq } from "drizzle-orm";
export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.query.account.findFirst({
      where: (a)=>eq(a.userId,userId)
    });

    return account;
  } catch {
    return null;
  }
};