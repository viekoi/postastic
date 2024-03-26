"use server";
import { and, asc, count, eq, or } from "drizzle-orm";
import db from "@/lib/db";
import { currentUser } from "@/lib/user";
import { privacyTypeValue } from "@/constansts";
import { medias as mediaTable } from "../lib/db/schema";
import { getMediasWhereClause } from "@/constansts/get-media-condition-clause";
import { post } from "@/migrations/schema";

export const getCommentReplies = async (
  pageParam: number,
  postId: string | null,
  parentId: string | null
) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!", pageParam };
  try {
    if (!post && !parentId) {
      return { error: "postId and parentId is needed" };
    }
    const limit = 5;
    const totalReplies = await db
      .select({ value: count() })
      .from(mediaTable)
      .where(getMediasWhereClause(user.id, "reply", parentId));

    const replies = await db.query.medias.findMany({
      where: (c) => getMediasWhereClause(user.id, "reply", parentId),
      with: {
        likes: {
          columns: {
            userId: true,
          },
        },
        replyBy: true,
        attachments: true,
      },

      orderBy: (p) => [asc(p.createdAt)],
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
          interactsCount: 0,
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
