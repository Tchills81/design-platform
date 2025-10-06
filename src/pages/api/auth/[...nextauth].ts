// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: { scope: "read:user user:email" }, // request extra GitHub profile info
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "github" && profile) {
        const githubProfile = profile as Record<string, unknown>;

        token.username = typeof githubProfile.login === "string" ? githubProfile.login : undefined;
        token.avatar = typeof githubProfile.avatar_url === "string" ? githubProfile.avatar_url : undefined;
        token.name = typeof githubProfile.name === "string" ? githubProfile.name : undefined;
        token.email = typeof githubProfile.email === "string" ? githubProfile.email : undefined;
        token.bio = typeof githubProfile.bio === "string" ? githubProfile.bio : undefined;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.username = typeof token.username === "string" ? token.username : undefined;
      session.user.avatar = typeof token.avatar === "string" ? token.avatar : undefined;
      session.user.name = typeof token.name === "string" ? token.name : undefined;
      session.user.email = typeof token.email === "string" ? token.email : undefined;
      session.user.bio = typeof token.bio === "string" ? token.bio : undefined;
      return session;
    },
  },
};

// ✅ Required default export for Next.js API route
export default NextAuth(authOptions);
