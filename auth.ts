import NextAuth, { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import Github from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "./lib/db";
import { LoginSchema } from "./schemas";
import { getUserByEmail, getUserById } from "./queries/user";

import { eq } from "drizzle-orm";
import { getAccountByUserId } from "./queries/account";
import { users } from "./lib/db/schema";

export const authConfig = {
  adapter: DrizzleAdapter(db),
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user;
          } else {
            return null;
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name!;
        session.user.email = token.email!;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;

      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user: data }) {
      data.id &&
        (await db
          .update(users)
          .set({ emailVerified: new Date() })
          .where(eq(users.id, data.id)));
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;

export const { handlers, auth, signOut, signIn } = NextAuth(authConfig);
