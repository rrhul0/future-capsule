import { fetchAndScheduleJobs } from "@/lib/emailQueue"

export const GET = async ()=>{
  await fetchAndScheduleJobs({days:1})
  return Response.json({success:true})
}