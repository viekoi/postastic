import {
  type BuildQueryResult,
  type DBQueryConfig,
  type ExtractTablesWithRelations,
  and,
  lte,
  or,
  eq,
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
}: {
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
    or(
      eq(medias.privacyType, privacyTypeValue.PUBLIC),
      and(
        eq(medias.privacyType, privacyTypeValue.PRIVATE),
        eq(medias.userId, userId)
      )
    ),
    type ? eq(medias.type, type) : undefined,
    parentId ? eq(medias.parentId, parentId) : undefined
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
