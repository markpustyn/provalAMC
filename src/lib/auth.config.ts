// import { DrizzleAdapter } from "@auth/drizzle-adapter"
import type { NextAuthConfig } from "next-auth"
import { User } from "next-auth"
// import { encode as defaultEncode } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
// import { v4 as uuid } from "uuid"
// import { getUserFromDb } from "./user.actions"
import { db } from "@/db/drizzle"
import { users } from "@/db/schema"
import { compare } from "bcryptjs"
import { eq } from "drizzle-orm";


const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1);

        if (user.length === 0) return null;

        const isPasswordValid = await compare(
          credentials.password.toString(),
          user[0].password,
        );

        if (!isPasswordValid) return null;

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].name,
        } as User;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
  secret: process.env.AUTH_SECRET!,
  pages: {
    signIn: '/'
  }
}

export default authConfig;
