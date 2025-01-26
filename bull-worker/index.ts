import sendEmail from '../src/lib/email'
import { Worker } from 'bullmq'
import { redisConnection } from '../src/utils/redis'
import { prisma } from '../prisma/prisma'

export type EmailJobData = {
  content: string
  capsuleId: string
  userIds: string[]
}

// Setup BullMQ worker
const worker = new Worker<EmailJobData>(
  'emailQueue',
  async (job) => {
    const { userIds, content, capsuleId } = job.data
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { recipientServices: { select: { serviceValue: true, type: true } } }
    })
    const emails = users.reduce<string[]>((acc, user) => {
      const email = user.recipientServices.find((s) => s.type === 'EMAIL')
      if (email) acc.push(email.serviceValue)
      return acc
    }, [])
    console.log(`Sending email to ${emails.join(', ')} with content: ${content}`)
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
