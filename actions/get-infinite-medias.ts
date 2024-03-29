"use server";
import { and, asc, count, desc, eq, or } from "drizzle-orm";
import db from "../lib/db";
import { currentUser } from "@/lib/user";
import { medias as mediaTable } from "@/lib/db/schema";
import { getMediasWhereClause } from "@/constansts/get-media-condition-clause";
import { InferResultType } from "../helpers/drizzle-type-helper";

type MediaWithRelations = InferResultType<
  "medias",
  {
    likes: {
      columns: {
        userId: true;
      };
    };
    childrenMedias: {
      columns: {
        id: true;
      };
    };
    createdUser: true;
    attachments: true;
  }
>;

export const getInfiniteMedias = async ({
  cursor,
  parentId,
  type,
}: {
  cursor?: { id: string; createdAt: Date };
  parentId?: string | null;
  type: "post" | "comment" | "reply";
}) => {
  const user = await currentUser();

  if (!user) return { error: "Unauthenticated!!!" };
  try {
    const limit = 10;
    const totalPages = await db
      .select({ value: count() })
      .from(mediaTable)
      .where(getMediasWhereClause(user.id, type, parentId));

    let posts: MediaWithRelations[] = [];

    if (cursor) {
      posts = await db.query.medias.findMany({
        where: () => getMediasWhereClause(user.id, type, parentId, cursor),
        with: {
          likes: {
            columns: {
              userId: true,
            },
          },
          childrenMedias: {
            columns: {
              id: true,
            },
            where: () => getMediasWhereClause(user.id),
          },

          createdUser: true,
          attachments: true,
        },
        orderBy: (p) => [
          type !== "post" ? asc(p.createdAt) : desc(p.createdAt),
        ],
        offset: 1,
        limit: limit,
      });
    } else {
      posts = await db.query.medias.findMany({
        where: () => getMediasWhereClause(user.id, type, parentId),
        with: {
          likes: {
            columns: {
              userId: true,
            },
          },
          childrenMedias: {
            columns: {
              id: true,
            },
            where: () => getMediasWhereClause(user.id),
          },
          createdUser: true,
          attachments: true,
        },
        orderBy: (p) => [
          type !== "post" ? asc(p.createdAt) : desc(p.createdAt),
        ],
        limit: limit,
      });
    }

    let nextCursor = undefined;

    if (posts.length === limit) {
      nextCursor = {
        id: posts[limit - 1].id,
        createdAt: posts[limit - 1].createdAt,
      };
    }

    return {
      success: posts.map((post) => {
        return {
          ...post,
          type: post.type,
          isLikedByMe: !!post.likes.find((like) => like.userId === user.id),
          likesCount: post.likes.length,
          interactsCount: post.childrenMedias.length,
          user: post.createdUser,
        };
      }),
      nextCursor: nextCursor,
      totalPages: Math.ceil(totalPages[0].value / 10),
      total: totalPages[0].value,
      limit: limit,
    };
  } catch (error) {
    console.log(error);
    return { error: `Could not fetch ${type}` };
  }
};
