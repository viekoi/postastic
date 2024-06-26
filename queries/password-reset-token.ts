import db from "@/lib/db";
import { and, eq } from "drizzle-orm";

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.mailToken.findFirst({
      where: (t) => and(eq(t.email, email), eq(t.type, "resetPassword")),
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.mailToken.findFirst({
      where: (t) => and(eq(t.token, token), eq(t.type, "resetPassword")),
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};
