import { v4 as uuidv4 } from "uuid";

import db from "./db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { verificationToken as dbVerificationToken, passwordResetToken as dbPasswordResetToken } from "@/migrations/schema";
import { eq } from "drizzle-orm";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";

export const generateVerificationToken = async (email: string,userId:string) => {
  const token = uuidv4();

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(dbVerificationToken)
      .where(eq(dbVerificationToken.id, existingToken.id));
  }

  const verficationToken = await db
    .insert(dbVerificationToken)
    .values({userId, email, token, expires })
    .returning()

  return verficationToken[0];
};

export const generatePasswordResetToken = async (email: string,userId:string) => {
  const token = uuidv4();

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(dbPasswordResetToken)
      .where(eq(dbPasswordResetToken.id, existingToken.id));
  }

  const passwordResetToken = await db
    .insert(dbPasswordResetToken)
    .values({userId, email, token, expires })
    .returning()

  return passwordResetToken[0];
};
