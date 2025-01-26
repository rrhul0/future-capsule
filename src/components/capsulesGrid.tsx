import getUser from '@/lib/getUser'
import { prisma } from '@prisma-client'
import React from 'react'
import Capsule from './capsule'

const CapsulesGrid = async () => {
  const user = await getUser()
  const capsules = await prisma.capsule.findMany({
    where: { ownerId: user.id },
    include: { author: true, originalCapsule: { include: { owner: true } } },
    orderBy: { scheduledTo: 'asc' }
  })
  return (
    <div className='flex gap-3 flex-wrap'>
      {capsules.map((capsule) => (
        <Capsule capsule={capsule} key={capsule.id} />
      ))}
    </div>
  )
}

export default CapsulesGrid
