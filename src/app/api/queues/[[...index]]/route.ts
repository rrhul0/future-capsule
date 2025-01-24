import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { HonoAdapter } from "@bull-board/hono";
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { serveStatic } from '@hono/node-server/serve-static';
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Queue } from "bullmq";
import Redis from 'ioredis';

const app = new Hono();

// Create a Redis connection
const connection = new Redis(process.env.REDIS_DB!,{
  maxRetriesPerRequest: null
});

// Create the Express adapter
const serverAdapter = new HonoAdapter(serveStatic);

const emailQueue = new Queue('emailQueue',{connection})

// Create Bull Board with your queues
createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

// Configure the server adapter
serverAdapter.setBasePath("/api/queues");
app.route('/api/queues', serverAdapter.registerPlugin());

const handleWithAuth = async (request: Request) => {
  await adminOnly();
  return handle(app)(request);
};

export const GET = handleWithAuth;
export const POST = handleWithAuth;
export const PUT = handleWithAuth;

async function adminOnly(){
  const user = await auth()
  if(!user) redirect('/auth/signin')
  if(user.user?.email!=='rahulraj1417@gmail.com') redirect('/dashboard')
}