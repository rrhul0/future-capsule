import sendEmail from '../src/lib/email'
import { Worker } from 'bullmq'
import { redisConnection } from '../src/utils/redis'
import { prisma } from '../prisma/prisma'

// Setup BullMQ worker
const worker = new Worker(
  'emailQueue',
  async (job) => {
    const { emails, content, capsuleId } = job.data as { emails: string[]; content: string; capsuleId: string }
    try {
      await sendEmail({ to: emails, htmlContent: content })
      await prisma.capsule.update({ where: { id: capsuleId }, data: { status: 'SENT' } })
    } catch {
      await prisma.capsule.update({ where: { id: capsuleId }, data: { status: 'FAILED' } })
    }

    console.log(`Email sent to ${emails.join(', ')}`)
  },
  { connection: redisConnection }
)

// Listen for job completion
worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result: ${result}`)
})

worker.on('ready', () => console.log('Worker is ready'))
