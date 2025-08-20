import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  type UserSession = DefaultSession["user"] & {
    id: string;
    role?: string;  // 👈 add role here
  };

  interface Session {
    user: UserSession;
  }

  interface User {
    id: string;
    role?: string;  // 👈 add role here
  }

  interface CredentialsInputs {
    email: string;
    password: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;  // 👈 add role here
  }
}
