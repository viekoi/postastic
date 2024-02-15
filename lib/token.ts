import { v4 as uuidv4 } from "uuid";

import db from "./db";
import { getVerificationTokenByEmail } from "@/data/vertification-token";
import { verificationToken as dbVerificationToken } from "@/migrations/schema";
import { eq } from "drizzle-orm";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(dbVerificationToken)
      .where(eq(dbVerificationToken.id, existingToken.id));
  }

  const verficationToken = await db
    .insert(dbVerificationToken)
    .values({ email, token, expires })
    .returning()

  return verficationToken[0];
};
