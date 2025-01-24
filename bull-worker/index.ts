import sendEmail from '../src/lib/email';
import { Worker } from 'bullmq';
import {redisConnection} from '../src/utils/redis';


// Setup BullMQ worker
const worker = new Worker('emailQueue', async (job) => {
  const { email, content } = job.data as {email:string,content:string}

  // Replace this with your email-sending logic
  await sendEmail({to:email, htmlContent:content});

  console.log(`Email sent to ${email}`);
},{connection:redisConnection});

// Listen for job completion
worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result: ${result}`);
});

worker.on('ready',()=>console.log('Worker is ready'))