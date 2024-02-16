"use server";

import db from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { user, verificationToken } from "@/migrations/schema";
import { eq } from "drizzle-orm";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  console.log(existingToken)

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db
    .update(user)
    .set({ emailVerified: new Date(), email: existingToken.email })
    .where(eq(user.id, existingUser.id));

  await db
    .delete(verificationToken)
    .where(eq(verificationToken.id, existingToken.id));

  return { success: "Email verified!" };
};
