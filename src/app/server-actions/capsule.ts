'use server'

import { prisma } from '@prisma-client'
import dayjs from 'dayjs'
import getUser from '@/lib/getUser'
import { CapsuleSharingAccess } from '@prisma/client'

export type CapsuleCreateAction = {
  message: string
  timestamp: string
}

export const createCapsuleAction = async ({ message, timestamp }: CapsuleCreateAction) => {
  const user = await getUser()

  const diffInDays = dayjs(timestamp).diff(dayjs(), 'day', true)
  if (diffInDays < 1) {
    return { error: 'Capsule must be scheduled at least 24 hours in the future' }
  }

  await prisma.capsule.create({
    data: {
      content: message,
      scheduledTo: new Date(timestamp),
      status: 'PENDING',
      authorId: user.id,
      ownerId: user.id
    }
  })

  return { status: 'success' }
}

export const changeSharingAccess = async (capsuleId: string, sharingAccess: CapsuleSharingAccess) => {
  const user = await getUser()

  const capsule = await prisma.capsule.update({
    where: { id: capsuleId, ownerId: user.id },
    data: { sharingAccess: sharingAccess }
  })

  if (!capsule) {
    return { error: 'You do not have permission to change sharing access or capsule not found' }
  }

  return { status: 'success' }
}
