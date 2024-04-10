"use server";

import db from "@/lib/db";
import { follows} from "@/lib/db/schema";
import { currentUser } from "@/lib/user";
import { and, eq } from "drizzle-orm";

export const follow = async (id: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!" };
  try {
    const existingFollowing = await db.query.users.findFirst({
      where: (u) => eq(u.id, id),
    });

    if (!existingFollowing) {
      return {
        error:
          "something went wrong, this user may not exist or had been disabled!!!",
      };
    }

    const existingFollow = await db.query.follows.findFirst({
      where: and(eq(follows.followerId, user.id), eq(follows.followingId, id)),
    });
    if (existingFollow) {
      await db
        .delete(follows)
        .where(
          eq(follows.id,existingFollow.id)
        );

      return { success: "Unfollowed" };
    }

    if (!existingFollow) {
      const follow = await db
        .insert(follows)
        .values({
          followerId: user.id,
          followingId: id,
        })
        .returning()
        .catch((error) => {
          if (error) return { error: error };
        });
      return { success: follow };
    }
  } catch (error) {
    console.log(error);
    return { error: "Coud not follow user!!!" };
  }
};
