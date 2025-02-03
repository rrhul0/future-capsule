'use client'
import React from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { getTimeLeft } from '@/utils/commonUtils'
import ShareCapsule from './shareCapsule'
import { useSession } from 'next-auth/react'
import { CapsuleData } from '@/app/server-actions/capsule'

dayjs.extend(duration)
const Capsule = ({ capsule }: { capsule: CapsuleData }) => {
  const { data: sessionData } = useSession()
  const isLocked = capsule.status !== 'SENT'
  return (
    <div className='bg-slate-800 w-fit rounded-md p-2'>
      <div>{capsule.id}</div>
      <div>{isLocked ? 'LOCKED will be open in ' + getTimeLeft(capsule.scheduledTo) : capsule.content}</div>
      {capsule.parentCapsule && <div>Shared by {capsule.parentCapsule.owner.name}</div>}
      {capsule.rootCapsule && (
        <div>
          Created by {capsule.rootCapsule.owner.id === sessionData?.user?.id ? 'You' : capsule.rootCapsule.owner.name}
        </div>
      )}
      <ShareCapsule id={capsule.id} sharingAccess={capsule.sharingAccess} />
    </div>
  )
}

export default Capsule
