"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schema";
import { getUserByEmail } from "@/data/user";
import { user } from "@/migrations/schema";
import { generateVerificationToken } from "@/lib/token";
import db from "@/lib/db";
import { sendMail } from "./send-mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
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
    .insert(user)
    .values({ email, password: hashedPassword, name });

  if (newUser) {
    const vertificationToken = await generateVerificationToken(email);
    const data = {
      name: name,
      confirmLink: `http://localhost:3000/auth/new-verification?token=${vertificationToken.token}`,
    };

    await sendMail({
      email: email,
      subject: "Activate your account",
      data,
    });

    return { success: "User created!" };
  } else {
    return { error: "Something went wrong!" };
  }
};
