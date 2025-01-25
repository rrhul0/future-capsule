import { SendMailOptions, createTransport } from 'nodemailer'

const transporter = createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
})

const sendEmail = async ({
  to,
  subject = 'Your Future Capsule',
  htmlContent
}: {
  to: string
  subject?: string
  htmlContent: string
}) => {
  const emailData: SendMailOptions = {
    subject: subject,
    html: htmlContent,
    to: [{ address: to, name: '' }],
    from: { address: 'future-capsule@clammy.xyz', name: 'Future Capsule' }
  }

  try {
    const res = await transporter.sendMail(emailData)
    console.log('Email sent successfully:', res)
    return res
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export default sendEmail
