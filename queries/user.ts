import db from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { getAccountByUserId } from "./account";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: (u) => eq(u.email, email),
    });

    if (user) return user;
  } catch (error) {
    console.log("💩💩💩 error", error);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: (u) => eq(u.id, id),
      with: {
        coverImages: {
          where: (p) =>
            and(eq(p.isActive, true), eq(p.profileImageType, "cover")),
        },
        avatarImages: {
          where: (p) =>
            and(eq(p.isActive, true), eq(p.profileImageType, "image")),
        },
      },
    });

    if (user) {
      const existingAccount = await getAccountByUserId(user.id);
      return {
        id: user.id,
        bio:user.bio,
        email: user.email,
        emailVerified: user.emailVerified,
        name: user.name,
        avatarImage: user.avatarImages.length ? user.avatarImages[0] : null,
        coverImage: user.coverImages.length ? user.coverImages[0] : null,
        isOAuth: !!existingAccount,
      };
    }
  } catch (error) {
    console.log("💩💩💩 error", error);
    return null;
  }
};
