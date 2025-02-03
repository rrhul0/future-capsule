import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Gitlab from 'next-auth/providers/gitlab'
import { createAccount, linkAccount, PrismaAdapter } from './adapter'
import { prisma } from '@prisma-client'
import { getToken } from 'next-auth/jwt'

export const { handlers, auth, signIn, signOut } = NextAuth((req) => ({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          userName: profile.login
        }
      },
      allowDangerousEmailAccountLinking: true
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          userName: profile.email.split('@')[0]
        }
      },
      allowDangerousEmailAccountLinking: true
    }),
    Gitlab({
      clientId: process.env.GITLAB_ID!,
      clientSecret: process.env.GITLAB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          userName: profile.username
        }
      },
      allowDangerousEmailAccountLinking: true
    })
  ],
  session: {
    strategy: 'jwt'
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    authorized: async ({ auth, request }) => {
      if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.includes('/share/capsule')) return true
      return !!auth
    },
    jwt: async ({ token, user }) => {
      if (user && user.id) {
        token.id = user.id
        token.userName = user.userName
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user.id = token.id
      session.user.userName = token.userName
      return session
    },
    async signIn({ user, account }) {
      if (!account) return false
      const token = await getToken({ req: req as Request, secret: process.env.AUTH_SECRET })
      if (!token || !token?.id) {
        // no user is logged in
        try {
          const createdUser = await createAccount({ name: user?.name, image: user?.image, userName: user.userName })
          if (createdUser && account) await linkAccount(account, createdUser.id, user.email as string)
        } catch {
          // user already in the db
          return true
        }
        return true
      }
      // a user is already logged in and trying to bind more accounts
      const currentUserId = token.id
      // #Cases
      // 1. email id is linked to current user
      //    1. user is trying to login with same provider which is already present
      //          does not have to do anything in this case
      //    2. user is trying to login with another provider
      //          link the new provider account to user

      // 2. email id not have linked to any account
      //      link email and provider account to current user

      // 3. email id of provider is linked to another user
      //      show error

      try {
        linkAccount(account, currentUserId, user.email as string)
      } catch {
        return false
      }
      return true
    }
  },
  basePath: '/auth'
}))
