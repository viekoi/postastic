"use server";
import { and, asc, count, desc, eq, or } from "drizzle-orm";
import db from "@/lib/db";
import { currentUser } from "@/lib/user";
import { privacyTypeValue } from "@/constansts";
import { medias as mediaTable } from "../lib/db/schema";
import { getMediasWhereClause } from "@/constansts/get-media-condition-clause";

export const getPostComments = async (pageParam: number, postId: string | null) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!", pageParam };
  try {
    if(!postId) return {error:"postId is needed"}
    const limit = 20;
    const totalComments = await db
      .select({ value: count() })
      .from(mediaTable)
      .where(getMediasWhereClause(user.id, "comment", postId));

    const comments = await db.query.medias.findMany({
      where: () => getMediasWhereClause(user.id, "comment", postId),
      with: {
        likes: {
          columns: {
            userId: true,
          },
        },
        commentReplies: {
          columns: {
            id: true,
          },
          where: (r) => getMediasWhereClause(user.id, "reply"),
        },
        commentBy: true,
        attachments: true,
      },

      orderBy: (p) => [asc(p.createdAt)],
      offset: (pageParam - 1) * limit,
      limit: limit,
    });

    return {
      success: comments.map((comment) => {
        return {
          ...comment,
          type: comment.type as "comment",
          postId: comment.postId as string,
          parentId: comment.parentId as string,
          isLikedByMe: !!comment.likes.find((like) => like.userId === user.id),
          likesCount: comment.likes.length,
          interactsCount: comment.commentReplies.length,
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
    return { error: "Could not fetch comments", pageParam };
  }
};
