"use server";
import { and, count, desc, eq, or } from "drizzle-orm";
import db from "@/lib/db";
import { currentUser } from "@/lib/user";
import { privacyTypeValue } from "@/constansts";
import { comments as commentTable } from "../lib/db/schema";

export const getPostComments = async (pageParam: number, postId: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!", pageParam };
  try {
    const limit = 20;
    const totalComments = await db
      .select({ value: count() })
      .from(commentTable)
      .where(
        and(
          eq(commentTable.postId, postId),
          or(
            eq(commentTable.privacyType, privacyTypeValue.PUBLIC),
            and(
              eq(commentTable.privacyType, privacyTypeValue.PRIVATE),
              eq(commentTable.userId, user.id)
            )
          )
        )
      );

    const comments = await db.query.comments.findMany({
      where: (c) =>
        and(
          eq(c.postId, postId),
          or(
            eq(c.privacyType, privacyTypeValue.PUBLIC),
            and(
              eq(c.privacyType, privacyTypeValue.PRIVATE),
              eq(c.userId, user.id)
            )
          )
        ),
      with: {
        likes: {
          columns: {
            userId: true,
          },
        },
        user: true,
        medias: true,
        replies: {
          where: (replies, { eq, or, and }) =>
            or(
              eq(replies.privacyType, privacyTypeValue.PUBLIC),
              and(
                eq(replies.privacyType, privacyTypeValue.PRIVATE),
                eq(replies.userId, user.id)
              )
            ),
        },
      },

      orderBy: (p) => [desc(p.createdAt)],
      offset: (pageParam - 1) * limit,
      limit: limit,
    });

    return {
      success: comments.map((comment) => {
        return {
          ...comment,
          isLikedByMe: !!comment.likes.find((like) => like.userId === user.id),
          likesCount: comment.likes.length,
          repliesCount: comment.replies.length,
        };
      }),
      currentPage: pageParam,
      nextPage: pageParam + 1,
      total: totalComments[0].value,
      totalPages: Math.ceil(totalComments[0].value / limit),
      limit: limit,
    };
  } catch (error) {
    console.log(error);
    return { error: "Could not fetch posts", pageParam };
  }
};
