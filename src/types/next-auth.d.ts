// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Profile {
    login?: string;
    avatar_url?: string;
    name?: string;
    email?: string;
    bio?: string;
  }

  interface Session {
    user: {
      name?: string;
      email?: string;
      image?: string;
      username?: string;
      avatar?: string;
      bio?: string;
    };
  }

  interface User {
    username?: string;
    avatar?: string;
    bio?: string;
  }
}
