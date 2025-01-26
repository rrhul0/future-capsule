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
      clientSecret: process.env.GITHUB_SECRET!
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    }),
    Gitlab({
      clientId: process.env.GITLAB_ID!,
      clientSecret: process.env.GITLAB_SECRET!
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
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user.id = token.id as string
      return session
    }
  },
  basePath: '/auth'
})
