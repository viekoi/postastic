"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "@/schema";
import { getUserByEmail } from "@/data/user";
import { user } from "@/migrations/schema";
import db from "@/lib/db";

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
    return { success: "User created!" };
  } else {
    return { error: "Something went wrong!" };
  }
};
