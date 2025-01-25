'use server'

import { signOut } from '@/app/auth'

export const signout = async () => {
  await signOut({ redirectTo: '/api/hello' })
}
