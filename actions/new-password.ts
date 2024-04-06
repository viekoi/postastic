"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { ResetPasswordSchema } from "@/schemas";

import db from "@/lib/db";

import { eq } from "drizzle-orm";
import { getUserById } from "@/queries/user";
import { currentUser } from "@/lib/user";
import { users } from "@/lib/db/schema";

export const newPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized" };
    }
    const dbUser = await getUserById(user.id);

    if (!dbUser) {
      return { error: "Unauthorized" };
    }

    const validatedFields = ResetPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { currentPassword, newPassword, confirmNewPassword } =
      validatedFields.data;

    if (currentPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(
        currentPassword,
        dbUser.password
      );

      if (!passwordsMatch) {
        return { error: "Incorrect password!" };
      }

      if (newPassword !== confirmNewPassword) {
        return { error: "Invalid confirm password!" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, dbUser.id));
    }

    if (!currentPassword && !dbUser.password) {
      if (newPassword !== confirmNewPassword) {
        return { error: "Invalid confirm password!" };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, dbUser.id));
    }

    return { success: "Password updated!" };
  } catch (error) {
    console.log(error);
    return { error: "Could not update password" };
  }
};
