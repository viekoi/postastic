"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schemas";

import db from "@/lib/db";

import { eq } from "drizzle-orm";
import { getUserByEmail } from "@/queries/user";
import { getPasswordResetTokenByToken } from "@/queries/password-reset-token";
import { passwordResetTokens, users } from "@/lib/db/schema";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  try {
    if (!token) {
      return { error: "Missing token!" };
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { password, confirmPassword } = validatedFields.data;

    if (password !== confirmPassword) {
      return { error: "Invalid confirm password!" };
    }

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return { error: "Invalid token!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Token has expired!" };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: "Email does not exist!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, existingUser.id));

    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));

    return { success: "Password updated!" };
  } catch (error) {
    console.log(error);
    return { error: "Could not update password" };
  }
};
