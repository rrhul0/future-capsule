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
      }
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
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
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    authorized: async ({ auth, request }) => {
      return request.nextUrl.pathname === '/' || !!auth
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
