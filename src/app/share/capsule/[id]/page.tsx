import { auth } from '@/auth'
import { prisma } from '@prisma-client'
import dayjs from 'dayjs'
import { redirect } from 'next/navigation'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const session = await auth()
  if (!session || !session.user || !session.user.id) return redirect('/auth/signin')
  if (!id) return redirect('/')
  const sharedCapsule = await prisma.capsule.findUnique({ where: { id } })
  if (!sharedCapsule) return null
  if (sharedCapsule.ownerId === session.user.id) return null // cant share own capsule to self
  // cant not share capsule with delay less then a day
  if (dayjs(sharedCapsule?.scheduledTo).diff(dayjs(), 'day') < 1) return null // TODO: show error message

  // if shared by link then create a duplicate capsule with status acceped
  const newCapsule = await prisma.capsule.create({
    data: {
      ownerId: session.user.id,
      status: 'PENDING',
      scheduledTo: sharedCapsule.scheduledTo,
      authorId: sharedCapsule.authorId,
      content: sharedCapsule.content,
      originalCapsuleId: sharedCapsule.id
    }
  })

  return (
    <>
      <div>Sharing Page</div>
      <div>{newCapsule.id}</div>
    </>
  )
}

export default Page
