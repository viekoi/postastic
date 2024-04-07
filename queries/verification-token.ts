import db from "@/lib/db";
import { and, eq } from "drizzle-orm";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.mailToken.findFirst({
      where: (t) => and(eq(t.token, token), eq(t.type, "confirmEmail")),
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.mailToken.findFirst({
      where: (t) => and(eq(t.email, email), eq(t.type, "confirmEmail")),
    });

    return verificationToken;
  } catch {
    return null;
  }
};
