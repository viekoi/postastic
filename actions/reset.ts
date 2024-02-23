"use server";
import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/queries/user";
import { sendMail } from "./send-mail";
import pageUrl from "@/lib/config";
import { generatePasswordResetToken } from "@/lib/token";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  try {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid email" };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: "Email not found" };
    }

    const passwordResetToken = await generatePasswordResetToken(
      existingUser.email,
      existingUser.id
    );

    await sendMail({
      email: existingUser.email,
      subject: "Reset your password",
      name: existingUser.name,
      confirmLink: `${pageUrl}/new-password?token=${passwordResetToken.token}`,
    });

    return { success: "Reset email sent!, the request will expire in 5 mins!" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!!!" };
  }
};
