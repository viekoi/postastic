"use server";
import { and, count, desc, eq, or } from "drizzle-orm";
import db from "../lib/db";
import { currentUser } from "@/lib/user";
import { privacyTypeValue } from "@/constansts";
import { posts as postTable } from "@/lib/db/schema";

export const getHomePosts = async (pageParam: number) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!", pageParam };
  try {
    const limit = 10;
    const totalPages = await db
      .select({ value: count() })
      .from(postTable)
      .where(
        or(
          eq(postTable.privacyType, privacyTypeValue.PUBLIC),
          and(
            eq(postTable.privacyType, privacyTypeValue.PRIVATE),
            eq(postTable.userId, user.id)
          )
        )
      );

    const posts = await db.query.posts.findMany({
      where: (p) =>
        or(
          eq(p.privacyType, privacyTypeValue.PUBLIC),
          and(
            eq(p.privacyType, privacyTypeValue.PRIVATE),
            eq(p.userId, user.id)
          )
        ),

      with: {
        likes: {
          columns: {
            userId: true,
          },
        },

        comments: {
          where: (comments, { eq, or, and }) =>
            or(
              eq(comments.privacyType, privacyTypeValue.PUBLIC),
              and(
                eq(comments.privacyType, privacyTypeValue.PRIVATE),
                eq(comments.userId, user.id)
              )
            ),
        },
        user: true,
        medias: true,
      },
      orderBy: (p) => [desc(p.createdAt)],
      offset: (pageParam - 1) * limit,
      limit: limit,
    });

    return {
      success: posts.map((post) => {
        return {
          ...post,
          isLikedByMe: !!post.likes.find((like) => like.userId === user.id),
          likesCount: post.likes.length,
          commentsCount: post.comments.length,
        };
      }),
      currentPage: pageParam,
      nextPage: pageParam + 1,
      totalPages: Math.ceil(totalPages[0].value / 10),
      total: totalPages[0].value,
      limit: limit,
    };
  } catch (error) {
    console.log(error);
    return { error: "Could not fetch posts", pageParam };
  }
};
