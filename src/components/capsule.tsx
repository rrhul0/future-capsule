import React from 'react'
import type { Capsule as CapsuleType, User } from '@prisma/client'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { getTimeLeft } from '@/utils/commonUtils'
import getUser from '@/lib/getUser'
import ShareCapsule from './shareCapsule'

dayjs.extend(duration)

const Capsule = async ({
  capsule
}: {
  capsule: CapsuleType & { rootCapsule: { owner: User } | null; parentCapsule: { owner: User } | null }
}) => {
  const user = await getUser()
  const isLocked = capsule.status !== 'SENT'
  return (
    <div className='bg-slate-800 w-fit rounded-md p-2'>
      <div>{capsule.id}</div>
      <div>{isLocked ? 'LOCKED will be open in ' + getTimeLeft(capsule.scheduledTo) : capsule.content}</div>
      {capsule.parentCapsule && <div>Shared by {capsule.parentCapsule.owner.name}</div>}
      {capsule.rootCapsule && (
        <div>Created by {capsule.rootCapsule.owner.id === user.id ? 'You' : capsule.rootCapsule.owner.name}</div>
      )}
      <ShareCapsule id={capsule.id} sharingAccess={capsule.sharingAccess} />
    </div>
  )
}

export default Capsule
