import CapsulesGrid from '@/components/capsulesGrid'
import CreateCapsule from '@/components/createCapsule'
import ShowContactsButton from '@/components/ShowContactsButton'
import getUser from '@/lib/getUser'
import { prisma } from '@prisma-client'
import React, { Suspense } from 'react'

const Page = async () => {
  const user = await getUser()
  const capsules = prisma.capsule.findMany({
    where: { ownerId: user.id, status: { not: 'NOT_ACCEPTED' } },
    include: { parentCapsule: { select: { owner: true } }, rootCapsule: { select: { owner: true } } },
    orderBy: { scheduledTo: 'asc' }
  })
  return (
    <div>
      <h1>Dashboard Page</h1>
      <h1>
        Welcome {user.name} <span className='text-blue-600 italic'>@{user.userName}</span>
      </h1>
      <p>{user.email}</p>
      <ShowContactsButton />
      <CreateCapsule />
      <Suspense fallback={<div>Loading Capsules...</div>}>
        <CapsulesGrid capsulesPromise={capsules} />
      </Suspense>
    </div>
  )
}

export default Page
