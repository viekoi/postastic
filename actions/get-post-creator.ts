"use server";

import db from "@/lib/db";

import { currentUser } from "@/lib/user";
import { eq } from "drizzle-orm";

export const getPostCreator = async (postId: string | null) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!" };

  try {
    if(!postId) return {error:"postId is needed"}
    const creator = await db.query.medias.findFirst({
      where: (m) => eq(m.id, postId),
      columns: {},
      with: {
        postBy: {
          columns: {
            id: true,
          },
        },
      },
    });

    if (creator) {
      return { success: { postCreatorId: creator.postBy.id } };
    }

    return { error: "Could not get creator" };
  } catch (error) {
    console.log(error);
    return { error: "Could not get creator" };
  }
};
