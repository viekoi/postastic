import { v4 as uuidv4 } from "uuid";
import db from "./db";
import { getVerificationTokenByEmail } from "@/queries/verification-token";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { getPasswordResetTokenByEmail } from "@/queries/password-reset-token";
import { mailToken } from "./db/schema";
import { getEmailResetTokenByEmail } from "@/queries/email-reset-token";

export const generateVerificationToken = async (
  email: string,
  userId: string
) => {
  const token = uuidv4();

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.delete(mailToken).where(eq(mailToken.id, existingToken.id));
  }

  const verficationToken = await db
    .insert(mailToken)
    .values({ userId, email, token, expires, type: "confirmEmail" })
    .returning();

  return verficationToken[0];
};

export const generatePasswordResetToken = async (
  email: string,
  userId: string
) => {
  const token = uuidv4();

  const expires = new Date(new Date().getTime() + 60 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.delete(mailToken).where(eq(mailToken.id, existingToken.id));
  }

  const passwordResetToken = await db
    .insert(mailToken)
    .values({ userId, email, token, expires, type: "resetPassword" })
    .returning();

  return passwordResetToken[0];
};

export const generateEmailResetToken= async (email: string, userId: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getEmailResetTokenByEmail(email);

  if (existingToken) {
    await db.delete(mailToken).where(eq(mailToken.id, existingToken.id));
  }

  const emailResetToken = await db
    .insert(mailToken)
    .values({ userId, email, token, expires, type: "resetEmail" })
    .returning();

  return emailResetToken[0];
};
