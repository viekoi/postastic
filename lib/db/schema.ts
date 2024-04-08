import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  boolean,
  AnyPgColumn,
  pgEnum,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { InferModel, relations } from "drizzle-orm";

//Emums
export const privacyType = pgEnum("privacyType", ["public", "private"]);
export const mediaType = pgEnum("mediaType", ["post", "comment", "reply"]);
export const attachmentType = pgEnum("attachmentType", ["image", "video"]);
export const profileImageType = pgEnum("profileImageType", ["image", "cover"]);
export const mailTokenType = pgEnum("mailTokenType", [
  "resetPassword",
  "resetEmail",
  "confirmEmail",
]);

// Tables
export const users = pgTable("user", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", {
    withTimezone: true,
    mode: "date",
  }),
  image: text("image"),
  password: text("password"),
  bio: text("bio").notNull().default(""),
});

export type User = InferModel<typeof users>;

export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export type Account = InferModel<typeof accounts>;

export const follows = pgTable("follow", {
  followerId: uuid("followerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  followingId: uuid("followingId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Follow = InferModel<typeof follows>;

export const mailToken = pgTable(
  "verificationToken",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    id: uuid("id").defaultRandom().notNull(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    type: mailTokenType("type").notNull(),
    expires: timestamp("expires", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);

export const medias = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  content: text("content").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createAt", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  isOverFlowContent: boolean("isOverFlowContent").notNull(),
  privacyType: privacyType(" privacyType").notNull().default("public"),
  type: mediaType("type").notNull(),
  parentId: uuid("parentId").references((): AnyPgColumn => medias.id, {
    onDelete: "cascade",
  }),
  postId: uuid("postId").references((): AnyPgColumn => medias.id, {
    onDelete: "cascade",
  }),
});

export type Media = InferModel<typeof medias>;

export const attachments = pgTable("attachment", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  type: attachmentType("type").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  publicId: text("publicId").notNull(),
  parentId: uuid("parentId").references(() => medias.id, {
    onDelete: "set null",
  }),
});

export type Attachment = InferModel<typeof attachments>;

export const profileImages = pgTable("profileImages", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  type: attachmentType("type").default("image").notNull(),
  profileImageType: profileImageType("profileImageType").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  publicId: text("publicId").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  isActive: boolean("isActive").notNull(),
});

export type ProfileImage = InferModel<typeof profileImages>;

export const likes = pgTable("like", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentId: uuid("parentId")
    .notNull()
    .references(() => medias.id, { onDelete: "cascade" }),
  created_at: timestamp("createdAt", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

export type Like = InferModel<typeof likes>;

//Relations

export const usersRelations = relations(users, ({ many }) => ({
  medias: many(medias),
  likes: many(likes),
  avatarImages: many(profileImages, { relationName: "avatarImages" }),
  coverImages: many(profileImages, { relationName: "coverImages" }),
  followers: many(follows, { relationName: "followers" }),
  followings: many(follows, { relationName: "followings" }),
}));

export const mediasRelations = relations(medias, ({ one, many }) => ({
  createdUser: one(users, {
    fields: [medias.userId],
    references: [users.id],
  }),
  childrenMedias: many(medias, { relationName: "childrenMedias" }),
  parentMedia: one(medias, {
    fields: [medias.parentId],
    references: [medias.id],
    relationName: "childrenMedias",
  }),
  likes: many(likes),
  attachments: many(attachments),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  parent: one(medias, {
    fields: [likes.parentId],
    references: [medias.id],
  }),
}));

export const attachmentsRelations = relations(attachments, ({ many, one }) => ({
  parent: one(medias, {
    fields: [attachments.parentId],
    references: [medias.id],
  }),
}));

export const profileImagesRelations = relations(profileImages, ({ one }) => ({
  userImages: one(users, {
    fields: [profileImages.userId],
    references: [users.id],
    relationName: "avatarImages",
  }),

  userCoverImages: one(users, {
    fields: [profileImages.userId],
    references: [users.id],
    relationName: "coverImages",
  }),
}));

export const followsRelations = relations(follows, ({  one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName:"followers"
  }),
  following: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName:"followings"
  }),
}));
