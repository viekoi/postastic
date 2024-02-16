"use server";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { AuthError } from "next-auth";
import { LoginSchema } from "@/schema";
import { getUserByEmail } from "@/data/user";
import { signIn } from "@/auth";
import { sendMail } from "./send-mail";
import { generateVerificationToken } from "@/lib/token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import pageUrl from "@/lib/config";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  const passwordsMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordsMatch) {
    return { error: "Invalid credentials!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,existingUser.id
    );

    await sendMail({
      email: existingUser.email,
      subject: "Activate your account",
      name: existingUser.name,
      confirmLink: `${pageUrl}/new-verification?token=${verificationToken.token}`,
    });

    return {
      success:
        "You have not vertified your account, a confirmation email was sent!",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
