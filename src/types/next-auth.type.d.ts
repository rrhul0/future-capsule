/* eslint-disable @typescript-eslint/no-unused-vars */
import type NextAuth from 'next-auth'
import type { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    userName: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    userName: string
  }
}
