"use server";

import db from "@/lib/db";
import { medias } from "@/lib/db/schema";
import { currentUser } from "@/lib/user";
import { eq } from "drizzle-orm";

export const deleteMedia = async (id: string) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!" };

  try {
    const deletedMedia = await db.delete(medias).where(eq(medias.id, id));

    if (deletedMedia) return { success: "Media deleted" };

    return { error: "Something went wrong!!!" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong!!!" };
  }
};
