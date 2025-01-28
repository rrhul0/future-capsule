import { shareCapsule } from '@/app/server-actions/capsule'
import { auth } from '@/auth'
import SaveSharedCapsuleButton from '@/components/saveSharedCapsuleButton'
import { redirect } from 'next/navigation'

// Show this page to not logged in users too
const Page = async ({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ accept: string }>
}) => {
  const { id } = await params
  const { accept } = await searchParams
  const session = await auth()

  if (accept === 'true' && session && session.user && session.user.id) {
    const res = await shareCapsule({ capsuleId: id, userIds: [session.user.id], acceptSharedCapsule: true })
    if (Array.isArray(res) && res[0].status === 'success') redirect('/dashboard')
  }

  return (
    <>
      <div>Sharing Page</div>
      <SaveSharedCapsuleButton id={id} userId={session?.user?.id} />
    </>
  )
}

export default Page
