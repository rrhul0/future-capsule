import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Gitlab from 'next-auth/providers/gitlab'
import { PrismaAdapter } from './adapter'
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
    async signIn({ user }) {
      const token = await getToken({ req: req as Request, secret: process.env.AUTH_SECRET })
      if (!token || !token?.id) {
        // no user is logged in
        return true
      }
      // a user is already logged in and trying to bind more accounts
      const currentUserId = token.id
      const currentUserEmails = await prisma.userRecipientService.findMany({
        where: { userId: currentUserId, type: 'EMAIL' },
        select: { serviceValue: true }
      })
      // means a logged in user tring to login with another provider
      // (or may with with another emailid)
      // attach this new user id to user's reciepint services
      if (user?.email && currentUserEmails.findIndex(({ serviceValue: email }) => email === user.email) === -1) {
        await prisma.userRecipientService.create({
          data: {
            type: 'EMAIL',
            serviceValue: user.email as string,
            userId: currentUserId
          }
        })
      }
      return true
    }
  },
  basePath: '/auth'
}))
