"use server";
import { and, count, desc, eq, ilike, isNotNull, lte } from "drizzle-orm";
import db from "../lib/db";
import { currentUser } from "@/lib/user";
import { users as dbUsers } from "@/lib/db/schema";

export const getIniniteUsers = async ({
  cursor,
  q,
}: {
  cursor?: { id: string; name: string };
  q: string;
}) => {
  if (q === "")
    return { message: "no search term", status: "failed", data: [] };

  const sessionUser = await currentUser();
  if (!sessionUser)
    return { message: "Unauthenticated!!!", status: "failed", data: [] };
  try {
    const limit = 20;
    const totalPages = await db
      .select({ value: count() })
      .from(dbUsers)
      .where(
        and(
          ilike(dbUsers.name, `%${q}%`),
          cursor ? lte(dbUsers.id, cursor.id) : undefined
        )
      );

    const users = await db.query.users.findMany({
      where: (u) =>
        and(
          ilike(u.name, `%${q}%`),
          cursor ? lte(u.id, cursor.id) : undefined,
          isNotNull(u.emailVerified)
        ),
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
      orderBy: (u) => [desc(u.id), desc(u.name)],
      limit: limit,
    });

    let nextCursor = undefined;

    if (users.length === limit) {
      nextCursor = {
        id: users[limit - 1].id,
        name: users[limit - 1].name,
      };
    }

    return {
      data: users.map((user) => {
        return {
          id: user.id,
          bio: user.bio,
          email: user.email,
          emailVerified: user.emailVerified,
          password: user.password,
          name: user.name,
          avatarImage: user.avatarImages.length ? user.avatarImages[0] : null,
          coverImage: user.coverImages.length ? user.coverImages[0] : null,
          followerCounts: user.followers.length,
          followingCounts: user.followings.length,
          isFollowedByMe: user.followers
            .map((fl) => fl.followerId)
            .includes(sessionUser.id),
        };
      }),
      status: "success",
      message: "success",
      nextCursor: nextCursor,
      totalPages: Math.ceil(totalPages[0].value / 10),
      total: totalPages[0].value,
      limit: limit,
    };
  } catch (error) {
    console.log(error);
    return { message: `Could not fetch users`, data: [], status: "failed" };
  }
};
