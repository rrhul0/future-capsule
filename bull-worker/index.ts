import sendEmail from '@/lib/email';
import { Worker } from 'bullmq';
import Redis from 'ioredis';

// Create a Redis connection
const connection = new Redis(process.env.REDIS_DB!,{
  maxRetriesPerRequest: null
});

// Setup BullMQ worker
const worker = new Worker('emailQueue', async (job) => {
  const { email, content } = job.data as {email:string,content:string}

  // Replace this with your email-sending logic
  await sendEmail({to:email, htmlContent:content});

  console.log(`Email sent to ${email}`);
},{connection});

// Listen for job completion
worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result: ${result}`);
});

worker.on('ready',()=>console.log('Worker is ready'))