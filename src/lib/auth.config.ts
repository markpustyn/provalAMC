import { DrizzleAdapter } from "@auth/drizzle-adapter"
import type { NextAuthConfig } from "next-auth"
import { User } from "next-auth"
import { encode as defaultEncode } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"
import Passkey from "next-auth/providers/passkey"
import { v4 as uuid } from "uuid"
import { getUserFromDb } from "./user.actions"
import { db } from "./db"
import {
  accountsTable,
  authenticatorsTable,
  sessionsTable,
  usersTable,
  verificationTokensTable,
} from "./schema/schema"

const adapter = DrizzleAdapter(db, {
  accountsTable,
  usersTable,
  authenticatorsTable,
  sessionsTable,
  verificationTokensTable,
} as any)

const authConfig: NextAuthConfig = {
  adapter,
  providers: [
    Github({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials

        const res = await getUserFromDb(email as string, password as string)
        if (res.success) {
          return res.data as User
        }

        return null
      },
    }),
    Passkey,
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true
      }
      return token
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid()

        if (!params.token.sub) {
          throw new Error("No user ID found in token")
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })

        if (!createdSession) {
          throw new Error("Failed to create session")
        }

        return sessionToken
      }
      return defaultEncode(params)
    },
  },
  secret: process.env.AUTH_SECRET!,
  experimental: { enableWebAuthn: true },
  pages: {
    signIn: '/' //sigin page
  }
}

export default authConfig;
