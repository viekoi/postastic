"use server";
import { and, asc, count, desc, eq } from "drizzle-orm";
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
  q,
}: {
  cursor?: { id: string; createdAt: Date };
  parentId?: string | null;
  profileId?: string;
  q?: string;
  type: (typeof MediaTypes)[number];
}) => {
  const user = await currentUser();
  if (!user)
    return { data: [], message: "Unauthenticated!!!", status: "failed" };

  const followingUserIds = await db.query.follows
    .findMany({
      where: (f) => eq(f.followerId, user.id),
      columns: {
        followingId: true,
      },
    })
    .then((data) => {
      return data.map((fi) => fi.followingId);
    });

  if (!followingUserIds)
    return { data: [], message: "something went wrong!!!", status: "failed" };
  try {
    const limit = 10;
    const totalPages = await db
      .select({ value: count() })
      .from(mediaTable)
      .where(
        profileId && type === "post"
          ? getPofileMediasWhereClause({
              profileId,
              parentId,
              userId: user.id,
              type,
            })
          : getMediasWhereClause({
              userId: user.id,
              type,
              parentId,
              followingUserIds,
              q,
            })
      );

    const medias = await db.query.medias.findMany({
      where: () =>
        profileId && type === "post"
          ? getPofileMediasWhereClause({
              profileId,
              parentId,
              userId: user.id,
              type,
              cursor,
            })
          : getMediasWhereClause({
              userId: user.id,
              type,
              parentId,
              cursor,
              followingUserIds,
              q,
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

    if (medias.length === limit) {
      nextCursor = {
        id: medias[limit - 1].id,
        createdAt: medias[limit - 1].createdAt,
      };
    }

    return {
      data: medias.map((post) => {
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
      status: "success",
      message: "success",
      nextCursor: nextCursor,
      totalPages: Math.ceil(totalPages[0].value / 10),
      total: totalPages[0].value,
      limit: limit,
    };
  } catch (error) {
    console.log(error);
    return { data: [], message: `Could not fetch ${type}`, status: "failed" };
  }
};
