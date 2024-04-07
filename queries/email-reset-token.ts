import db from "@/lib/db";
import { and, eq } from "drizzle-orm";

export const getEmailResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.mailToken.findFirst({
      where: (t) => and(eq(t.email, email), eq(t.type, "resetEmail")),
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const getEmailResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.mailToken.findFirst({
      where: (t) => and(eq(t.token, token), eq(t.type, "resetEmail")),
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};
