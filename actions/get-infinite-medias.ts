"use server";
import { and, asc, count, desc, eq, lte } from "drizzle-orm";
import db from "../lib/db";
import { currentUser } from "@/lib/user";
import { medias as mediaTable } from "@/lib/db/schema";
import {
  getMediasWhereClause,
  getPofileMediasWhereClause,
} from "../lib/db/util";
import { MediaTypes } from "@/constansts";

export const getInfiniteMedias = async ({
  cursor,
  profileId,
  parentId,
  type,
}: {
  cursor?: { id: string; createdAt: Date };
  parentId?: string | null;
  profileId?: string;
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
        profileId
          ? getPofileMediasWhereClause({
              profileId,
              parentId,
              userId: user.id,
              type,
            })
          : getMediasWhereClause({ userId: user.id, type, parentId })
      );

    const posts = await db.query.medias.findMany({
      where: () =>
        profileId
          ? getPofileMediasWhereClause({
              profileId,
              parentId,
              userId: user.id,
              type,
              cursor,
            })
          : getMediasWhereClause({ userId: user.id, type, parentId, cursor }),
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
      orderBy: (p) => [
        type !== "post" ? asc(p.createdAt) : desc(p.createdAt),
        desc(p.id),
      ],
      limit: limit,
    });

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
