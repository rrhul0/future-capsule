import sendEmail from "@/lib/email"

export const GET = () => {
  sendEmail({to:'rr025765@gmail.com',htmlContent:'hi there',subject:'Hiii'})
  return Response.json({ name: 'John Doe' })
}