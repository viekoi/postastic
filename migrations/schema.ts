import { pgTable, pgEnum, uuid, text, timestamp, foreignKey, boolean, primaryKey, unique, integer } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const mediaType = pgEnum("mediaType", ['reply', 'comment', 'post', 'video', 'image'])
export const privacyType = pgEnum("privacyType", ['more', 'private', 'public'])
export const attachmentType = pgEnum("attachmentType", ['video', 'image'])
export const profileImageType = pgEnum("profileImageType", ['cover', 'image'])
export const mailTokenType = pgEnum("mailTokenType", ['confirmEmail', 'resetEmail', 'resetPassword'])


export const user = pgTable("user", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { withTimezone: true, mode: 'date' }),
	password: text("password"),
	image: text("image"),
	bio: text("bio").default('').notNull(),
});

export const media = pgTable("media", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	type: mediaType("type").notNull(),
	createAt: timestamp("createAt", { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	parentId: uuid("parentId"),
	content: text("content").notNull(),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	updatedAt: timestamp("updatedAt", { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	isOverFlowContent: boolean("isOverFlowContent").notNull(),
	privacyType: privacyType(" privacyType").default('public').notNull(),
	postId: uuid("postId"),
},
(table) => {
	return {
		mediaParentIdMediaIdFk: foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "media_parentId_media_id_fk"
		}).onDelete("cascade"),
		mediaPostIdMediaIdFk: foreignKey({
			columns: [table.postId],
			foreignColumns: [table.id],
			name: "media_postId_media_id_fk"
		}).onDelete("cascade"),
	}
});

export const like = pgTable("like", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	parentId: uuid("parentId").notNull().references(() => media.id, { onDelete: "cascade" } ),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
});

export const attachment = pgTable("attachment", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	type: attachmentType("type").notNull(),
	url: text("url").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	parentId: uuid("parentId").references(() => media.id, { onDelete: "set null" } ),
	publicId: text("publicId").notNull(),
});

export const profileImages = pgTable("profileImages", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	type: text("type").default('image').notNull(),
	profileImageType: profileImageType("profileImageType").notNull(),
	url: text("url").notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
	publicId: text("publicId").notNull(),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "set null" } ),
	isActive: boolean("isActive").notNull(),
});

export const verificationToken = pgTable("verificationToken", {
	id: uuid("id").defaultRandom().notNull(),
	email: text("email").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { withTimezone: true, mode: 'date' }).notNull(),
	userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	type: mailTokenType("type").notNull(),
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