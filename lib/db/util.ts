import {
  type BuildQueryResult,
  type DBQueryConfig,
  type ExtractTablesWithRelations,
  and,
  lte,
  or,
  eq,
  inArray,
  ilike,
} from "drizzle-orm";
import * as schema from "./schema";

import { medias } from "@/lib/db/schema";
import { MediaTypes, privacyTypeValue } from "@/constansts";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export const getMediasWhereClause = ({
  userId,
  type,
  parentId,
  cursor,
  followingUserIds,
  q,
}: {
  userId: string;
  type?: (typeof MediaTypes)[number];
  parentId?: string | null;
  cursor?: {
    id: string;
    createdAt: Date;
  };
  followingUserIds?: string[];
  q?: string;
}) => {
  return and(
    cursor ? lte(medias.createdAt, cursor.createdAt) : undefined,
    or(
      eq(medias.privacyType, privacyTypeValue.PUBLIC),
      and(
        eq(medias.privacyType, privacyTypeValue.PRIVATE),
        eq(medias.userId, userId)
      )
    ),
    type ? eq(medias.type, type) : undefined,
    type === "post" && followingUserIds
      ? inArray(medias.userId, [...followingUserIds, userId])
      : undefined,
    parentId ? eq(medias.parentId, parentId) : undefined,
    q && q !== "" ? ilike(medias.content, `%${q}%`) : undefined
  );
};

export const getPofileMediasWhereClause = ({
  profileId,
  type,
  parentId,
  cursor,
}: {
  profileId: string;
  userId: string;
  type?: (typeof MediaTypes)[number];
  parentId?: string | null;
  cursor?: {
    id: string;
    createdAt: Date;
  };
}) => {
  return and(
    cursor ? lte(medias.createdAt, cursor.createdAt) : undefined,
    eq(medias.userId, profileId),
    type ? eq(medias.type, type) : undefined,
    parentId ? eq(medias.parentId, parentId) : undefined
  );
};
