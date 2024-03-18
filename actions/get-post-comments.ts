"use server";
import { and, count, desc, eq, or } from "drizzle-orm";
import db from "@/lib/db";
import { currentUser } from "@/lib/user";
import { privacyTypeValue } from "@/constansts";
import { medias as mediaTable } from "../lib/db/schema";

export const getPostComments = async (pageParam: number, postId: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!", pageParam };
  try {
    const limit = 20;
    const totalComments = await db
      .select({ value: count() })
      .from(mediaTable)
      .where(
        and(
          or(
            eq(mediaTable.privacyType, privacyTypeValue.PUBLIC),
            and(
              eq(mediaTable.privacyType, privacyTypeValue.PRIVATE),
              eq(mediaTable.userId, user.id)
            )
          ),
          eq(mediaTable.type, "comment")
        )
      );

    const totalReplies = await db
      .select({ value: count() })
      .from(mediaTable)
      .where(
        and(
          or(
            eq(mediaTable.privacyType, privacyTypeValue.PUBLIC),
            and(
              eq(mediaTable.privacyType, privacyTypeValue.PRIVATE),
              eq(mediaTable.userId, user.id)
            )
          ),
          eq(mediaTable.type, "reply")
        )
      );

    const comments = await db.query.medias.findMany({
      where: (c) =>
        and(
          or(
            eq(c.privacyType, privacyTypeValue.PUBLIC),
            and(
              eq(c.privacyType, privacyTypeValue.PRIVATE),
              eq(c.userId, user.id)
            )
          ),
          eq(c.type, "comment")
        ),
      with: {
        likes: {
          columns: {
            userId: true,
          },
        },
        commentBy: true,
        attachments: true,
      },

      orderBy: (p) => [desc(p.createdAt)],
      offset: (pageParam - 1) * limit,
      limit: limit,
    });

    return {
      success: comments.map((comment) => {
        return {
          ...comment,
          type: comment.type as "comment",
          isLikedByMe: !!comment.likes.find((like) => like.userId === user.id),
          likesCount: comment.likes.length,
          repliesCount: totalReplies[0].value,
          user: comment.commentBy,
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
