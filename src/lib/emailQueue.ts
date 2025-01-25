import { redisConnection } from '../utils/redis'
import { prisma } from '../../prisma/prisma'
import { Queue } from 'bullmq'

// Setup BullMQ queue
const emailQueue = new Queue('emailQueue', { connection: redisConnection })

export async function fetchAndScheduleJobs({ days }: { days: number }) {
  const now = new Date()
  const daysLater = new Date(now.setHours(0, 0, 0, 0) + days * 24 * 60 * 60 * 1000)
  // Fetch schedules for the next 1 days or any which has open time in past
  const capsulesToQueue = await prisma.capsule.findMany({
    where: {
      scheduledTo: {
        lte: daysLater
      },
      status: 'PENDING'
    }
  })

  for (const capsule of capsulesToQueue) {
    const delay = new Date(capsule.scheduledTo).getTime() - now.getTime()

    // Add job to BullMQ with delay
    await emailQueue.add(
      'sendEmail',
      { emails: capsule.recipientEmails, content: capsule.content, capsuleId: capsule.id },
      { delay, attempts: 3 }
    )
  }

  // Update capsules status to QUEUED
  await prisma.capsule.updateMany({
    where: {
      id: { in: capsulesToQueue.map((c) => c.id) }
    },
    data: {
      status: 'QUEUED'
    }
  })

  console.log(`Jobs scheduled for the next ${days} days.`)
  await emailQueue.close()
  redisConnection.disconnect()
  await prisma.$disconnect()
}
