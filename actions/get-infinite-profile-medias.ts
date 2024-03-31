"use server";
import { and, asc, count, desc, eq, lte } from "drizzle-orm";
import db from "../lib/db";
import { currentUser } from "@/lib/user";
import { medias as mediaTable } from "@/lib/db/schema";
import {
  InferResultType,
  getMediasWhereClause,
  getPofileMediasWhereClause,
} from "../lib/db/util";
import { MediaTypes } from "@/constansts";

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

export const getInfiniteProfileMedias = async ({
  cursor,
  profileId,
  parentId,
  type,
}: {
  cursor?: { id: string; createdAt: Date };
  parentId?: string | null;
  profileId: string;
  type: (typeof MediaTypes)[number];
}) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthenticated!!!" };
  try {
    const limit = 10;
    const totalPages = await db
      .select({ value: count() })
      .from(mediaTable)
      .where(
        getPofileMediasWhereClause({
          profileId,
          parentId,
          userId: user.id,
          type,
        })
      );

    let posts: MediaWithRelations[] = [];

    if (cursor) {
      posts = await db.query.medias.findMany({
        where: () =>
          getPofileMediasWhereClause({
            profileId,
            parentId,
            userId: user.id,
            type,
            cursor,
          }),
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
            where: () => getMediasWhereClause({ userId: user.id }),
          },

          createdUser: true,
          attachments: true,
        },
        orderBy: (p) => [
          type !== "post" ? asc(p.createdAt) : desc(p.createdAt),
          desc(p.id),
        ],
        limit: limit,
      });
      console.log(profileId);
      const test = await db.query.medias.findMany({
        where: and(
          lte(mediaTable.createdAt, cursor.createdAt),
          eq(mediaTable.userId, profileId)
          // type ? eq(mediaTable.type, type) : undefined,
          // parentId ? eq(mediaTable.parentId, parentId) : undefined
        ),
      });

      console.log("test:", test);
    } else {
      posts = await db.query.medias.findMany({
        where: () =>
          getPofileMediasWhereClause({
            profileId,
            parentId,
            userId: user.id,
            type,
          }),
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
            where: () => getMediasWhereClause({ userId: user.id }),
          },
          createdUser: true,
          attachments: true,
        },
        orderBy: (p) => [
          type !== "post" ? asc(p.createdAt) : desc(p.createdAt),
          desc(p.id),
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
