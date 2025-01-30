'use server'

import getUser from '@/lib/getUser'
import { prisma } from '@prisma-client'

export const getUserData = async () => {
  console.log('ran once')
  const user = await getUser()
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      userName: true,
      image: true,
      recipientServices: { select: { id: true, serviceValue: true, type: true } },
      Contacts: { select: { id: true, name: true, userName: true } },
      BlockedUsers: { select: { id: true, name: true, userName: true } },
      DefaultAcceptUsers: { select: { id: true, name: true, userName: true } }
    }
  })
  return userData
}
