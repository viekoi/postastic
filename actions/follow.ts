"use server";

import db from "@/lib/db";
import { likes } from "@/lib/db/schema";
import { currentUser } from "@/lib/user";
import { and, eq } from "drizzle-orm";

export const like = async (id: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!" };
  try {
    const existingMedia = await db.query.medias.findFirst({
      where: (m) => eq(m.id, id),
    });

    if (!existingMedia) {
      return { error: "something went wrong, this media may not exist or had been deleted!!!" };
    }

    const existingLike = await db.query.likes.findFirst({
      where: and(eq(likes.parentId, id), eq(likes.userId, user.id)),
    });
    if (existingLike) {
      await db.delete(likes).where(eq(likes.id, existingLike.id));

      return { success: "Removed Like" };
    }

    if (!existingLike) {
      const like = await db
        .insert(likes)
        .values({
          parentId: id,
          userId: user.id,
        })
        .returning()
        .catch((error) => {
          if (error) return { error: error };
        });
      return { success: like };
    }
  } catch (error) {
    console.log(error);
    return { error: "Coud not like post!!!" };
  }
};
