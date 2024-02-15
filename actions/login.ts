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
    const vertificationToken = await generateVerificationToken(
      existingUser.email
    );

    const data = {
      name: existingUser.name,
      confirmLink: `http://localhost:3000/auth/new-verification?token=${vertificationToken.token}`,
    };
    await sendMail({
      email: existingUser.email,
      subject: "Activate your account",
      data,
    });

    return {
      success:
        "You have not vertified your account,aconfirmation email was sent!",
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
