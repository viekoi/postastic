import db from "@/lib/db";
import { eq } from "drizzle-orm";

export const getVerificationTokenByToken = async (
  token: string
) => {
  try {
    const verificationToken = await db.query.verificationToken.findFirst({
      where:(vt=>eq(vt.token,token))
    });

    return verificationToken;
  } catch {
    return null;
  }
}

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const verificationToken = await db.query.verificationToken.findFirst({
      where: (vt=>eq(vt.email,email))
    });

    return verificationToken;
  } catch {
    return null;
  }
}