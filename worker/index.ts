import sendEmail from '@/lib/email'
import { Worker } from 'bullmq'
import { redisConnection } from '@/utils/redis'
import type { ConnectionOptions } from 'bullmq'
import { prisma } from '@prisma-client'

export type EmailJobData = {
  content: string
  capsuleId: string
  recipientServiceIds: string[]
}

// Setup BullMQ worker
const worker = new Worker<EmailJobData>(
  'emailQueue',
  async (job) => {
    const { recipientServiceIds, content, capsuleId } = job.data
    const recipientServices = await prisma.userRecipientService.findMany({
      where: { id: { in: recipientServiceIds } }
    })
    const emails = recipientServices.reduce<string[]>((acc, service) => {
      if (service.type === 'EMAIL') acc.push(service.serviceValue)
      return acc
    }, [])

    await sendEmail({ to: emails, htmlContent: content })
    await prisma.capsule.update({ where: { id: capsuleId }, data: { status: 'SENT' } })

    console.log(`Email sent to ${emails.join(', ')}`)
  },
  { connection: redisConnection as ConnectionOptions }
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
