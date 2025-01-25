'use server'

import { prisma } from '@prisma-client'
import { auth } from '../auth'

export const createCapsuleAction = async (data: FormData) => {
  const session = await auth()
  if (!session || !session.user || !session.user.email) return { error: 'You must be logged in to create a capsule' }

  const emails = data.get('emails') as string
  const message = data.get('message') as string
  const time = data.get('openTime') as string
  const date = data.get('openDate') as string

  const utcDateTime = new Date(new Date(date).setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1], 0)))

  if (utcDateTime.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000) {
    return { error: 'Capsule must be scheduled at least 24 hours in the future' }
  }

  await prisma.capsule.create({
    data: {
      content: message,
      scheduledTo: utcDateTime,
      status: 'PENDING',
      recipientEmails: emails.split(',').map((e) => e.trim()),
      author: {
        connect: {
          email: session.user.email
        }
      }
    }
  })

  return { status: 'success' }
}
