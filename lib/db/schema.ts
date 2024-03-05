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
});

export type User = InferModel<typeof users>;

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  likes: many(likes),
  comments: many(comments),
  replies: many(replies),
}));

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

export const verificationTokens = pgTable(
  "verificationToken",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    id: uuid("id").defaultRandom().notNull(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);

export const passwordResetTokens = pgTable(
  "passwordResetToken",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    id: uuid("id").defaultRandom().notNull(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (prt) => ({
    compoundKey: primaryKey({ columns: [prt.id, prt.token] }),
  })
);

export const privacyType = pgEnum("privacyType", ["public", "private", "more"]);

export const posts = pgTable("post", {
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
});

export type Post = InferModel<typeof posts>;

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  medias: many(medias),
  likes: many(likes),
  comments: many(comments),
}));

export const mediaType = pgEnum("mediaType", ["image", "video"]);

export const medias = pgTable("media", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  type: mediaType("type").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  publicId: text("publicId").notNull(),
  parentId: uuid("parentId").notNull(),
});

export const mediasRelations = relations(medias, ({ one }) => ({
  post: one(posts, {
    fields: [medias.parentId],
    references: [posts.id],
  }),
  reply: one(replies, {
    fields: [medias.parentId],
    references: [replies.id],
  }),
  comment: one(comments, {
    fields: [medias.parentId],
    references: [comments.id],
  }),
}));

export type Media = InferModel<typeof medias>;

export const likes = pgTable("like", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id),
  parentId: uuid("parentId").notNull(),
  created_at: timestamp("createdAt", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

export type Like = InferModel<typeof likes>;

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.parentId],
    references: [posts.id],
  }),
  reply: one(replies, {
    fields: [likes.parentId],
    references: [replies.id],
  }),
  comment: one(comments, {
    fields: [likes.parentId],
    references: [comments.id],
  }),
}));

export const comments = pgTable("comment", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  content: text("content").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("postId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
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
});


export const replies = pgTable("reply", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  content: text("content").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: uuid("postId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  commentId: uuid("commentId").notNull().references((): AnyPgColumn => comments.id),
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
});



export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),

  medias: many(medias),
  likes: many(likes),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  replies: many(replies),
}));

export type Comment = InferModel<typeof comments>;
export type Reply = InferModel<typeof replies>;

export const repliesRelations = relations(replies, ({ one, many }) => ({
  comment: one(comments, {
    fields: [replies.id],
    references: [comments.id],
  }),
  user: one(users, {
    fields: [replies.userId],
    references: [users.id],
  }),

  medias: many(medias),
  likes: many(likes),
  post: one(posts, {
    fields: [replies.postId],
    references: [posts.id],
  }),
}));
