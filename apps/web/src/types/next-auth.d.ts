import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserSession } from "@agendacortes/types";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: UserSession;
  }

  interface User extends UserSession {
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user: UserSession;
  }
}

