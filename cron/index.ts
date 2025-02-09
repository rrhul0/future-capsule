import { fetchAndScheduleJobs } from '@/lib/emailQueue'

console.log('Cron job started')

await fetchAndScheduleJobs({ days: 1 })

console.log('Cron job completed')
