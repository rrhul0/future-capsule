import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Gitlab from 'next-auth/providers/gitlab'
import { PrismaAdapter } from './adapter'
import { prisma } from '@prisma-client'

export const { handlers, auth, signIn, signOut } = NextAuth({
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
    }
  },
  basePath: '/auth'
})
