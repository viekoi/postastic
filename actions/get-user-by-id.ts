"use server";

import db from "@/lib/db";
import { currentUser } from "@/lib/user";
import { getAccountByUserId } from "@/queries/account";
import { and, eq } from "drizzle-orm";

export const getUserByIdAction = async (id: string) => {
  const sessionUser = await currentUser();
  if (!sessionUser) return null;
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
        followers: {
          columns: {
            followerId: true,
          },
        },
        followings: {
          columns: {
            followingId: true,
          },
        },
      },
    });

    if (user) {
      const existingAccount = await getAccountByUserId(user.id);
      return {
        id: user.id,
        bio: user.bio,
        email: user.email,
        emailVerified: user.emailVerified,
        password: user.password,
        name: user.name,
        avatarImage: user.avatarImages.length ? user.avatarImages[0] : null,
        coverImage: user.coverImages.length ? user.coverImages[0] : null,
        isOAuth: !!existingAccount,
        followerCounts: user.followers.length,
        followingCounts: user.followings.length,
        isFollowedByMe: user.followers
          .map((fl) => fl.followerId)
          .includes(sessionUser?.id),
      };
    }
  } catch (error) {
    console.log("💩💩💩 error", error);
    return null;
  }
};
