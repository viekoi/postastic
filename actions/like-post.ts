"use server";

import db from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { currentUser } from "@/lib/user";
import { and, eq } from "drizzle-orm";

export const likePost = async (postId: string) => {
  try {
    const user = await currentUser();

    if (!user) return { error: "Unauthenticated!!!" };

    const existingLike = await db.query.likes.findFirst({
      where: and(eq(likes.postId, postId), eq(likes.userId, user.id)),
    });
    if (existingLike) {
      await db.delete(likes).where(eq(likes.id, existingLike.id));

      return { success: "Removed Like" };
    }

    if (!existingLike) {
      const like = await db
        .insert(likes)
        .values({
          postId,
          userId: user.id,
        })
        .returning()
        .catch((error) => {
          if (error) return { error: error };
        });

      return { success: like };
    }
  } catch (error) {
    console.log(error)
   return { error:"Coud not like post!!!" }
  }
};
