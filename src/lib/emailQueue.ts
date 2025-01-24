import { prisma } from '@prisma-client';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

// Create a Redis connection
const connection = new Redis(process.env.REDIS_DB!,{
  maxRetriesPerRequest: null
});

// Setup BullMQ queue
const emailQueue = new Queue('emailQueue',{connection});

export async function fetchAndScheduleJobs({days}: {days: number}) {
  const now = new Date();
  const daysLater = new Date(now.getTime() + days*24 * 60 * 60 * 1000);

  // Fetch schedules for the next 1 days
  const capsulesToQueue = await prisma.capsule.findMany({
    where:{
      scheduledTo:{
        gte:now,
        lte:daysLater
      },
      status:'PENDING'
    }
  })

  for (const capsule of capsulesToQueue){
    const delay = new Date(capsule.scheduledTo).getTime() - now.getTime();

    // Add job to BullMQ with delay
    await emailQueue.add(
      'sendEmail',
      { emails: capsule.recipientEmails, content: capsule.content },
      { delay, attempts: 3 }
    );
  }
  
  // Update capsules status to QUEUED
  await prisma.capsule.updateMany({
    where:{
      id: {in:capsulesToQueue.map(c=>c.id)}
    },
    data:{
      status:'QUEUED'
    }
  })

  console.log(`Jobs scheduled for the next ${days} days.`);
}