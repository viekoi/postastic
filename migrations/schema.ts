import { pgTable, pgEnum, uuid, text, timestamp, foreignKey, boolean, primaryKey, unique, integer } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const mediaType = pgEnum("mediaType", ['video', 'image'])
export const privacyType = pgEnum("privacyType", ['more', 'private', 'public'])


export const user = pgTable("user", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { withTimezone: true, mode: 'date' }),
	image: text("image"),
	password: text("password"),
});

export const post = pgTable("post", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	content: text("content").notNull(),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	createAt: timestamp("createAt", { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	isReply: boolean("isReply").default(false).notNull(),
	replyId: uuid("replyId"),
	isOverFlowContent: boolean("isOverFlowContent").notNull(),
	privacyType: privacyType(" privacyType").default('public').notNull(),
},
(table) => {
	return {
		postReplyIdPostIdFk: foreignKey({
			columns: [table.replyId],
			foreignColumns: [table.id],
			name: "post_replyId_post_id_fk"
		}),
	}
});

export const media = pgTable("media", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	type: mediaType("type").notNull(),
	url: text("url").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	postId: uuid("postId").notNull().references(() => post.id, { onDelete: "cascade" } ),
});

export const like = pgTable("like", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("userId").notNull().references(() => user.id),
	postId: uuid("postId").notNull().references(() => post.id, { onDelete: "cascade" } ),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const passwordResetToken = pgTable("passwordResetToken", {
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	id: uuid("id").defaultRandom().notNull(),
	email: text("email").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'date' }).notNull(),
},
(table) => {
	return {
		passwordResetTokenIdTokenPk: primaryKey({ columns: [table.id, table.token], name: "passwordResetToken_id_token_pk"}),
		passwordResetTokenTokenUnique: unique("passwordResetToken_token_unique").on(table.token),
	}
});

export const verificationToken = pgTable("verificationToken", {
	id: uuid("id").defaultRandom().notNull(),
	email: text("email").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'date' }).notNull(),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		verificationTokenIdTokenPk: primaryKey({ columns: [table.id, table.token], name: "verificationToken_id_token_pk"}),
		verificationTokenTokenUnique: unique("verificationToken_token_unique").on(table.token),
	}
});

export const account = pgTable("account", {
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text("scope"),
	idToken: text("id_token"),
	sessionState: text("session_state"),
},
(table) => {
	return {
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"})
	}
});