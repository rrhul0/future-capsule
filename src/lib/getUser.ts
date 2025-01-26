import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function getUser() {
  const session = await auth()
  if (!session || !session.user || !session.user.id) return redirect('/auth/signin')
  return session.user
}
