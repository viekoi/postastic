"use server";

import db from "@/lib/db";
import { currentUser } from "@/lib/user";
import { and, eq } from "drizzle-orm";

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
        createdUser: {
          with: {
            coverImages: {
              where: (p) =>
                and(eq(p.isActive, true), eq(p.profileImageType, "cover")),
            },
            avatarImages: {
              where: (p) =>
                and(eq(p.isActive, true), eq(p.profileImageType, "image")),
            },
          },
        },
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
          user: {
            id: post.createdUser.id,
            email: post.createdUser.email,
            emailVerified: post.createdUser.emailVerified,
            name: post.createdUser.name,
            avatarImage: post.createdUser.avatarImages.length
              ? post.createdUser.avatarImages[0]
              : null,
            coverImage: post.createdUser.coverImages.length
              ? post.createdUser.coverImages[0]
              : null,
          },
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
