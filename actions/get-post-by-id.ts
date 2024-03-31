"use server";

import db from "@/lib/db";
import { currentUser } from "@/lib/user";
import {eq } from "drizzle-orm";

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
        createdUser: true,
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
          user: post.createdUser,
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
