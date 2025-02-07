import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL!

export const redisConnection = new Redis(redisUrl + '?family=0', {
  maxRetriesPerRequest: null
})
