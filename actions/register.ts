"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/queries/user";
import db from "@/lib/db";
import { sendMail } from "./send-mail";
import pageUrl from "@/lib/config";
import { generateVerificationToken } from "@/lib/token";
import { users } from "@/lib/db/schema";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { email, password, name, confirmPassword } = validatedFields.data;

    if (password !== confirmPassword) {
      return { error: "Invalid confirm password!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already in use!" };
    }

    const newUser = await db
      .insert(users)
      .values({ email, password: hashedPassword, name })
      .returning();

    if (newUser) {
      const vertificationToken = await generateVerificationToken(
        email,
        newUser[0].id
      );

      await sendMail({
        email: email,
        subject: "Activate your account",
        name: name,
        confirmLink: `${pageUrl}/new-verification?token=${vertificationToken.token}`,
      });

      return { success: "User created!" };
    } else {
      return { error: "Something went wrong!" };
    }
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!" };
  }
};
