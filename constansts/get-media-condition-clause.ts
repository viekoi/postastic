import { and, eq, lte, or } from "drizzle-orm";
import { medias } from "@/lib/db/schema";
import { privacyTypeValue } from ".";

export const getMediasWhereClause = (
  userId: string,
  type?: "post" | "comment" | "reply",
  parentId?: string | null,
  cursor?: {
    id: string;
    createdAt: Date;
  }
) => {
  return and(
    cursor ? lte(medias.createdAt, cursor.createdAt) : undefined,
    or(
      eq(medias.privacyType, privacyTypeValue.PUBLIC),
      and(
        eq(medias.privacyType, privacyTypeValue.PRIVATE),
        eq(medias.userId, userId)
      )
    ),
    type ? eq(medias.type, type): undefined,
    parentId ? eq(medias.parentId, parentId) : undefined
  );
};
