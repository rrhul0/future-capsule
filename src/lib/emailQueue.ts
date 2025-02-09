import { redisConnection } from '@/utils/redis'
import { prisma } from '@prisma-client'
import { Queue } from 'bullmq'
import { EmailJobData } from '@worker'

// Setup BullMQ queue
const emailQueue = new Queue<EmailJobData>('emailQueue', { connection: redisConnection })

export async function fetchAndScheduleJobs({ days }: { days: number }) {
  const now = new Date()
  const daysLater = new Date(now.setHours(0, 0, 0, 0) + days * 24 * 60 * 60 * 1000)
  // Fetch schedules for the next 1 days or any which has open time in past
  const capsulesToQueue = await prisma.capsule.findMany({
    where: {
      scheduledTo: {
        lt: daysLater
      },
      status: 'PENDING'
    },
    include: {
      recipientServices: true
    }
  })

  for (const capsule of capsulesToQueue) {
    const delay = new Date(capsule.scheduledTo).getTime() - Date.now()
    // Add job to BullMQ with delay
    await emailQueue.add(
      'sendEmail',
      {
        content: capsule.content,
        capsuleId: capsule.id,
        recipientServiceIds: capsule.recipientServices.map((s) => s.id)
      },
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

  console.log(`${capsulesToQueue.length} Jobs scheduled of time ${now.toISOString()} to ${daysLater.toISOString()}.`)
  await emailQueue.close()
  redisConnection.disconnect()
  await prisma.$disconnect()
}
