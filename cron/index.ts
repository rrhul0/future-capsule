import { fetchAndScheduleJobs } from "../src/lib/emailQueue"

console.log('Cron job started')

fetchAndScheduleJobs({days:1})

console.log('Cron job completed')