"use server";
import {
  generateEmailResetToken,
  generateVerificationToken,
} from "@/lib/token";
import { currentUser } from "@/lib/user";
import { getUserByEmail, getUserById } from "@/queries/user";
import { ResetSchema } from "@/schemas";
import * as z from "zod";
import { sendMail } from "./send-mail";
import pageUrl from "@/lib/config";
export const newEmail = async (values: z.infer<typeof ResetSchema>) => {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
      return { error: "Unauthorized" };
    }

    if (user.isOAuth)
      return {
        error: "This is a OAuth account, action is cancel!!!",
      };

    if (dbUser.email === values.email) {
      return {
        error: "No change detected!!!",
      };
    }

    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== dbUser.id) {
      return { error: "Email already in use!" };
    }

    const emailResetToken = await generateEmailResetToken(
      values.email,
      dbUser.id
    );

    await sendMail({
      email: emailResetToken.email,
      subject: "Confirm change your email",
      name: dbUser.name,
      confirmLink: `${emailResetToken.token}`,
    });
    return {
      success:
        "A confirmation code has been sent to your new email, please confirm it in 5 minutes",
    };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!!!" };
  }
};
