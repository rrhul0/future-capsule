import sendEmail from '../src/lib/email'
import { Worker } from 'bullmq'
import { redisConnection } from '../src/utils/redis'
import { prisma } from '../prisma/prisma'

type EmailJobData = {
  emails: string[]
  content: string
  capsuleId: string
}

// Setup BullMQ worker
const worker = new Worker<EmailJobData>(
  'emailQueue',
  async (job) => {
    const { emails, content, capsuleId } = job.data
    await sendEmail({ to: emails, htmlContent: content })
    await prisma.capsule.update({ where: { id: capsuleId }, data: { status: 'SENT' } })

    console.log(`Email sent to ${emails.join(', ')}`)
  },
  { connection: redisConnection }
)

// Listen for job completion
worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result: ${result}`)
})

worker.on('ready', () => console.log('Worker is ready'))

worker.on('failed', (job, err) => {
  if (!job) return
  if (job?.attemptsMade < 3) {
    console.log(`Job ${job.id} failed with ${err}. Retrying...`)
    return job.retry()
  }
  console.log(`Job ${job.id} failed with ${err}`)
})
