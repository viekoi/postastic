import db from "@/lib/db";
import { eq } from "drizzle-orm";

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetToken.findFirst({
      where: (prt) => eq(prt.email, email),
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
      const passwordResetToken = await db.query.passwordResetToken.findFirst({
        where: (prt) => eq(prt.token, token),
      });
  
      return passwordResetToken;
    } catch (error) {
      return null;
    }
  };
  
