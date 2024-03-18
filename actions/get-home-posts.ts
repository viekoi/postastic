"use server";
import { and, count, desc, eq, or } from "drizzle-orm";
import db from "../lib/db";
import { currentUser } from "@/lib/user";
import { privacyTypeValue } from "@/constansts";
import { medias as mediaTable } from "@/lib/db/schema";

export const getHomePosts = async (pageParam: number) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!", pageParam };
  try {
    const limit = 10;
    const totalPages = await db
      .select({ value: count() })
      .from(mediaTable)
      .where(
        and(
          or(
            eq(mediaTable.privacyType, privacyTypeValue.PUBLIC),
            and(
              eq(mediaTable.privacyType, privacyTypeValue.PRIVATE),
              eq(mediaTable.userId, user.id)
            )
          ),
          eq(mediaTable.type, "post")
        )
      );

    const totalComments = await db
      .select({ value: count() })
      .from(mediaTable)
      .where(
        and(
          or(
            eq(mediaTable.privacyType, privacyTypeValue.PUBLIC),
            and(
              eq(mediaTable.privacyType, privacyTypeValue.PRIVATE),
              eq(mediaTable.userId, user.id)
            )
          ),
          eq(mediaTable.type, "comment")
        )
      );

    const posts = await db.query.medias.findMany({
      where: (p) =>
        and(
          or(
            eq(mediaTable.privacyType, privacyTypeValue.PUBLIC),
            and(
              eq(mediaTable.privacyType, privacyTypeValue.PRIVATE),
              eq(mediaTable.userId, user.id)
            )
          ),
          eq(mediaTable.type, "post")
        ),

      with: {
        likes: {
          columns: {
            userId: true,
          },
        },
        postBy: true,
        attachments: true,
      },
      orderBy: (p) => [desc(p.createdAt)],
      offset: (pageParam - 1) * limit,
      limit: limit,
    });

    return {
      success: posts.map((post) => {
        return {
          ...post,
          type: post.type as "post",
          isLikedByMe: !!post.likes.find((like) => like.userId === user.id),
          likesCount: post.likes.length,
          commentsCount: totalComments[0].value,
          user:post.postBy
        };
      }),
      currentPage: pageParam,
      nextPage: pageParam + 1,
      totalPages: Math.ceil(totalPages[0].value / 10),
      total: totalPages[0].value,
      limit: limit,
    };
  } catch (error) {
    console.log(error);
    return { error: "Could not fetch posts", pageParam };
  }
};
