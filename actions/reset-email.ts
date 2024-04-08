"use server";

import db from "@/lib/db";
import { mailToken, users } from "@/lib/db/schema";
import { currentUser } from "@/lib/user";
import { getEmailResetTokenByToken } from "@/queries/email-reset-token";
import { getUserByEmail, getUserById } from "@/queries/user";

import { eq } from "drizzle-orm";

export const resetEmail = async (token: string) => {
  try {
    const existingToken = await getEmailResetTokenByToken(token);
    if (!existingToken) {
      return { error: "Token does not exist!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Token has expired!" };
    }

    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(existingToken.userId);

    if (!dbUser) {
      return { error: "Unauthorized" };
    }

    if (dbUser.isOAuth)
      return {
        error: "This is a OAuth account, action is cancel!!!",
      };

    if (dbUser.email === existingToken.email) {
      return {
        error: "No change detected!!!",
      };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (existingUser && existingUser.id !== dbUser.id) {
      return { error: "Email already in use!" };
    }

    const updatedUser = await db
      .update(users)
      .set({ email: existingToken.email })
      .where(eq(users.id, existingToken.userId))
      .returning();

    updatedUser &&
      (await db.delete(mailToken).where(eq(mailToken.id, existingToken.id)));

    return { success: "update successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Could not verify email!!!" };
  }
};
