import { auth } from '@/auth'
import { User } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function getUser(): Promise<User & { id: string }> {
  const session = await auth()
  if (!session || !session.user || !session.user.id) return redirect('/auth/signin')
  return { id: session.user.id as string, ...session.user }
}
