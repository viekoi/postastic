"use server";

import db from "@/lib/db";
import { currentUser } from "@/lib/user";
import { and, eq, or } from "drizzle-orm";

export const getPostById = async (postId: string) => {
  if (!postId) return null;
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated" };

  try {
    const post = await db.query.medias.findFirst({
      where: (m) => eq(m.id, postId),
      with: {
        likes: {
          columns: {
            userId: true,
          },
        },
        postBy: true,
        attachments: true,
      },
    });

    if (post) {
      return {
        success: {
          ...post,
          type: post.type as "post",
          isLikedByMe: !!post.likes.find((like) => like.userId === user.id),
          likesCount: post.likes.length,
          user: post.postBy,
        },
      };
    }
    return { error: "error" };
  } catch (error) {
    return {
      error: "error",
    };
  }
};
