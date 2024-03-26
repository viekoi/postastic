import { and, eq, or } from "drizzle-orm";
import { medias } from "@/lib/db/schema";
import { privacyTypeValue } from ".";

export const getMediasWhereClause = (
  userId: string,
  type: "post" | "comment" | "reply",
  parentId?: string | null
) => {
  if (parentId) {
    return and(
      or(
        eq(medias.privacyType, privacyTypeValue.PUBLIC),
        and(
          eq(medias.privacyType, privacyTypeValue.PRIVATE),
          eq(medias.userId, userId)
        )
      ),
      eq(medias.type, type),
      eq(medias.parentId, parentId)
    );
  }
  return and(
    or(
      eq(medias.privacyType, privacyTypeValue.PUBLIC),
      and(
        eq(medias.privacyType, privacyTypeValue.PRIVATE),
        eq(medias.userId, userId)
      )
    ),
    eq(medias.type, type)
  );
};
