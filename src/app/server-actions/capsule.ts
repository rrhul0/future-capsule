'use server'

import { prisma } from '@prisma-client'
import { auth } from '../auth'

export type CapsuleCreateAction = {
  emails: string[]
  message: string
  timestamp: string
}

export const createCapsuleAction = async ({ emails, message, timestamp }: CapsuleCreateAction) => {
  const session = await auth()
  if (!session || !session.user || !session.user.email) return { error: 'You must be logged in to create a capsule' }

  if (new Date(timestamp).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000) {
    return { error: 'Capsule must be scheduled at least 24 hours in the future' }
  }

  await prisma.capsule.create({
    data: {
      content: message,
      scheduledTo: new Date(timestamp),
      status: 'PENDING',
      recipientEmails: emails,
      author: {
        connect: {
          email: session.user.email
        }
      }
    }
  })

  return { status: 'success' }
}
