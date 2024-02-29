"use server";
import { and, desc, eq, or } from "drizzle-orm";
import db from "../lib/db";
import { currentUser } from "@/lib/user";
import { privacyTypeValue } from "@/constansts";

export const getInfiniteaccessiblePosts = async (pageParam: number) => {
  try {
    const limit = 10;

    const user = await currentUser();

    if (!user) return { error: "Unauthenticated!!!", pageParam };
    const posts = await db.query.posts.findMany({
      where: (p) =>
        or(
          eq(p.privacyType, privacyTypeValue.PUBLIC),
          and(
            eq(p.privacyType, privacyTypeValue.PRIVATE),
            eq(p.userId, user.id)
          )
        ),

      with: {
        user: true,
        likes: true,
        medias:true
      },
      orderBy: (p) => [desc(p.createdAt)],
      offset: pageParam * limit,
      limit: limit,
    });

    return {
      success: posts,
      pageParam,
    };
  } catch (error) {
    console.log(error);
    return { error: "Could not fetch posts", pageParam };
  }
};
