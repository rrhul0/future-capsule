import { auth } from '@auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const Page = async () => {
  const user = await auth()
  if (user) redirect('/dashboard')
  return (
    <div>
      <Link href='/auth/signin'>Sign In</Link>
      <h1>Page</h1>
    </div>
  )
}

export default Page
