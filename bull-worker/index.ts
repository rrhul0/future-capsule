import sendEmail from '../src/lib/email'
import { Worker } from 'bullmq'
import { redisConnection } from '../src/utils/redis'

// Setup BullMQ worker
const worker = new Worker(
  'emailQueue',
  async (job) => {
    const { emails, content } = job.data as { emails: string[]; content: string }

    // Replace this with your email-sending logic
    await sendEmail({ to: emails, htmlContent: content })

    console.log(`Email sent to ${emails.join(', ')}`)
  },
  { connection: redisConnection }
)

// Listen for job completion
worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result: ${result}`)
})

worker.on('ready', () => console.log('Worker is ready'))
