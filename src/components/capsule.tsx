import React from 'react'
import type { Capsule as CapsuleType, User } from '@prisma/client'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { getTimeLeft } from '@/utils/commonUtils'
import getUser from '@/lib/getUser'

dayjs.extend(duration)

const Capsule = async ({
  capsule
}: {
  capsule: CapsuleType & { originalCapsule: { owner: User } | null; author: User | null }
}) => {
  const user = await getUser()
  const isLocked = capsule.status !== 'SENT'
  return (
    <div className='bg-slate-800 w-fit rounded-md p-2'>
      <div>{capsule.id}</div>
      <div>{isLocked ? 'LOCKED will be open in ' + getTimeLeft(capsule.scheduledTo) : capsule.content}</div>
      {capsule.originalCapsule && <div>Shared by {capsule.originalCapsule.owner.name}</div>}
      {capsule.author && <div>Created by {capsule.author.id === user.id ? 'You' : capsule.author.name}</div>}
    </div>
  )
}

export default Capsule
