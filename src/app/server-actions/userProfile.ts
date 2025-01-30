'use server'

import { AccountInformationFormValuesType } from '@/components/settings/AccountInformation'
import getUser from '@/lib/getUser'
import { prisma } from '@prisma-client'

export const getUserData = async () => {
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

export const updateAccountInformation = async (data: AccountInformationFormValuesType) => {
  const user = await getUser()
  if (!data.name || !data.userName || !data.avatarUrl) {
    return { status: 'failed', error: 'All fields are required' }
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name,
      userName: data.userName,
      image: data.avatarUrl
    }
  })
  return { status: 'success' }
}
