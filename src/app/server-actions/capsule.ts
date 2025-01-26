'use server'

import { prisma } from '@prisma-client'
import { auth } from '@auth'
import dayjs from 'dayjs'

export type CapsuleCreateAction = {
  emails: string[]
  message: string
  timestamp: string
}

export const createCapsuleAction = async ({ message, timestamp }: CapsuleCreateAction) => {
  const session = await auth()
  if (!session || !session.user || !session.user.id) return { error: 'You must be logged in to create a capsule' }

  const diffInDays = dayjs(timestamp).diff(dayjs(), 'day', true)
  if (diffInDays < 1) {
    return { error: 'Capsule must be scheduled at least 24 hours in the future' }
  }

  await prisma.capsule.create({
    data: {
      content: message,
      scheduledTo: new Date(timestamp),
      status: 'PENDING',
      authorId: session.user.id
    }
  })

  return { status: 'success' }
}
