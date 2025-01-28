import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

export const redisConnection = new Redis(redisUrl + '?family=0', {
  maxRetriesPerRequest: null
})
