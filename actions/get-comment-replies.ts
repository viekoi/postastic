"use server";
import { and, count, desc, eq, or } from "drizzle-orm";
import db from "@/lib/db";
import { currentUser } from "@/lib/user";
import { privacyTypeValue } from "@/constansts";
import { medias as mediaTable } from "../lib/db/schema";

export const getCommentReplies = async (
  pageParam: number,
  postId: string,
  parentId: string
) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!", pageParam };
  try {
    const limit = 5;
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
          eq(mediaTable.type, "reply"),
          and(eq(mediaTable.parentId, parentId), eq(mediaTable.postId, postId))
        )
      );

    const replies = await db.query.medias.findMany({
      where: (c) =>
        and(
          or(
            eq(c.privacyType, privacyTypeValue.PUBLIC),
            and(
              eq(c.privacyType, privacyTypeValue.PRIVATE),
              eq(c.userId, user.id)
            )
          ),
          eq(c.type, "reply"),
          and(eq(mediaTable.parentId, parentId), eq(mediaTable.postId, postId))
        ),
      with: {
        likes: {
          columns: {
            userId: true,
          },
        },
        replyBy: true,
        attachments: true,
      },

      orderBy: (p) => [desc(p.createdAt)],
      offset: (pageParam - 1) * limit,
      limit: limit,
    });

    return {
      success: replies.map((reply) => {
        return {
          ...reply,
          type: reply.type as "reply",
          parentId: reply.parentId as string,
          postId: reply.postId as string,
          isLikedByMe: !!reply.likes.find((like) => like.userId === user.id),
          likesCount: reply.likes.length,
          user: reply.replyBy,
        };
      }),
      currentPage: pageParam,
      nextPage: pageParam + 1,
      total: totalReplies[0].value,
      totalPages: Math.ceil(totalReplies[0].value / limit),
      limit: limit,
    };
  } catch (error) {
    console.log(error);
    return { error: "Could not fetch replies", pageParam };
  }
};