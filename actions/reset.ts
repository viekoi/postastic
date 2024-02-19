"use server";
import * as z from "zod";
import { ResetSchema } from "@/schema";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/token";
import { sendMail } from "./send-mail";
import pageUrl from "@/lib/config";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
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
};
