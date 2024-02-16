import { pgTable, uuid, text, timestamp, foreignKey, primaryKey, unique, integer } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const user = pgTable("user", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { withTimezone: true, mode: 'date' }),
	image: text("image"),
	password: text("password"),
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